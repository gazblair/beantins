"use strict"

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var AWS = require('aws-sdk');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
    ]
})

transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]

class LocalTestSession {

    async setupLocalNetwork(){
        logger.info("Setup local network...")
        try{
            await docker.createNetwork({"Name":"local-dev"}) 
            logger.info("Created network local-dev")
        }
        catch(error){
            logger.info("Failed to create network local-dev - " + error)
        }
    }
    
    invokeSetupDynamoDB(success, failure){
        logger.info("Setup dynamoDB instance...")
        try{
            docker.createContainer({ 
                Image: 'amazon/dynamodb-local', 
                name: 'local-dynamodb', 
                Network: "local-dev", 
                NetworkingConfig: {
                    "EndpointsConfig": {
                        "local-dev" : {
                            "Aliases":["dynamodb"]
                        }
                    }
                },
                PortBindings: { "8000/tcp": [{ "HostPort": "8000" }] } }, async function (err,container){
                    if (err) {
                        logger.info("Error", err);
                        failure()
                    }
                    else {
                        logger.info("DynamoDB instance created");

                        await container.start()
                        logger.info("DynamoDB instance started")
                        success()
                    }
              })
        }
        catch(error){
            logger.error(error)
            failure()
        }
    }
    
    setupDynamoDB(){
        return new Promise((resolve, reject) => {
            this.invokeSetupDynamoDB((successResponse) => {
                resolve();
            }, (errorResponse) => {
                reject()
            })
        })
    }    
    invokeCreateUserTable(success, failure)
    {
        logger.info("Creating user table...")
        AWS.config.update({region: 'us-east-1', endpoint: process.env.DYNAMODB_ENDPOINT})
    
        var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
        var params = {
        AttributeDefinitions: [
            {
            AttributeName: 'Name',
            AttributeType: 'S'
            },
            {
            AttributeName: 'Phone',
            AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
            AttributeName: 'Phone',
            KeyType: 'HASH'
            },
            {
            AttributeName: 'Name',
            KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        TableName: 'Users_Dev',
        StreamSpecification: {
            StreamEnabled: false
        }
        };
    
        ddb.createTable(params, function (err, data) {
            if (err) {
                logger.error("Error", err);
                failure()
            }
            else {
                logger.info("Table Created", data);
                success()
             }
        })
    }

    createUserTable(){
        return new Promise((resolve, reject) => {
            this.invokeCreateUserTable((successResponse) => {
                resolve();
            }, (errorResponse) => {
                reject()
            })
        })
    }

    invokeLambda(successCallback, errorCallback) {
        const { spawn } = require('child_process');
        this.samLocalProcess = spawn('sam', ["local", "start-api", "--docker-network", "local-dev", "--env-vars", "localEnvironment.json", "--template-file", "template.yaml"])

        this.samLocalProcess.stderr.on('data', (data) => {
            logger.info(`lambda process:${data}`)
            if (data.includes("CTRL+C")){
                logger.info("Lambda up and running...")
                successCallback()
            }
        })
    }

    setupLambda(){
        return new Promise((resolve, reject) => {
            this.invokeLambda((successResponse) => {
                resolve();
            }, (errorResponse) => {
                reject()
            })
        })
    }

    async cleanUpDynamoDB(){
        try{
            let containers = await docker.listContainers({filters: {"name":["local-dynamodb"]}, all: true })
            logger.info("Search for dynamoDB container found...")
            logger.info(containers)
    
            if (containers.length > 0){
                logger.info("removing dynamoDB container")
                var container = docker.getContainer(containers[0].Id)
                try{
                    await container.stop()
                }
                catch{
                    // do nothing
                }
                finally{
                    await container.remove()
                }
            }
        }
        catch(error){
            logger.error(error)
        }
    }
    
    async cleanUpLocalNetwork(){
        try{
            logger.info("Search for local network found...")
            let networks = await docker.listNetworks({filters: {"name":["local-dev"]} })
            logger.info(networks)
            if (networks.length > 0){
                logger.info("removing local-dev network")
                var localNetwork = docker.getNetwork(networks[0].Id)
                await localNetwork.remove()
                logger.info("Local network removed")
            }
            else
            {
                logger.info("No local network found")
            }
        }
        catch(error){
            logger.error(error)
        }
    }
    
    async cleanUpLambda(){
        this.samLocalProcess.kill("SIGINT")
    }

    async start(){
        await this.setupLocalNetwork()
        await this.setupDynamoDB()
        await this.createUserTable()
        await this.setupLambda()
    }

    async stop(){
        await this.cleanUpDynamoDB()
        await this.cleanUpLocalNetwork()
        await this.cleanUpLambda()
    }

}

module.exports = {
    LocalTestSession: LocalTestSession
}
