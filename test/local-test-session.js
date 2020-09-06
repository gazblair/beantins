"use strict"

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var AWS = require('aws-sdk');
const logger = require('../test/logger');

class LocalTestSession {

    async setupLocalNetwork(){
        logger.info("Setup local network...")
        try{
            await docker.createNetwork({"Name":"local-dev"}) 
            logger.verbose("Created network local-dev")
        }
        catch(error){
            logger.error("Failed to create network local-dev - " + error)
        }
    }

    pullImage(image = 'node', version = 'latest') {
        this.imageName = `${image}:${version}`;
        logger.info(`=> Pulling ${this.imageName}`);
        return new Promise((resolve, reject) => {
          docker.pull(this.imageName, (error, stream) => {
            let message = '';
            if(error)
            { 
                logger.error("Failed to pull docker image" + image + " because of error:" + error)
                return reject(error)
            }
            stream.on('data', data => message += data);
            stream.on('end', () => resolve(message));
            stream.on('error', error => reject(error));
          });
        });
      }

    async pullLambdaContainer(){
        return await this.pullImage('lambci\/lambda', 'nodejs10.x')
    }

    async invokeSetupDynamoDB(success, failure){
        logger.info("Setup dynamoDB instance...")
        try{
            logger.verbose("Retrieve latest dynamo DB container...")

            await this.pullImage("amazon/dynamodb-local", "latest")

            logger.verbose("Retrieved DynamoDB container")
                
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
                PortBindings: { "8000/tcp": [{ "HostPort": "8000" }] } }, async function (error,container){
                    if (error) {
                        logger.verbose("Error", error);
                        failure()
                    }
                    else {
                        logger.verbose("DynamoDB instance created");

                        await container.start()
                        logger.verbose("DynamoDB instance started")
                        success()
                    }
              })
        }
        catch(error){
            logger.error("DynamoDB setup failed - " + error)
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
    

        ddb.createTable(params, function (error, data) {
            if (error) {
                logger.error("Error", error);
                failure()
            }
            else {
                logger.verbose("Table Created", data);
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

    buildLambdaParameters() {

        let parameters = ["local", "start-api", "--docker-network", "local-dev", "--env-vars", "localEnvironment.json", "--template-file", "template.yaml", "--skip-pull-image"]

        if (process.env.DEBUG_PORT != null){
            parameters.push("-d", process.env.DEBUG_PORT) 
        }

        logger.verbose("Lambda parameters - " + parameters)

        return parameters
    }

    invokeLambda(successCallback, errorCallback) {
        const { spawn } = require('child_process');
        this.samLocalProcess = spawn('sam', this.buildLambdaParameters())
        logger.info("Launching lambda")

        this.samLocalProcess.stderr.on('data', (data) => {
            logger.info(data)
            if (data.includes("CTRL+C")){
                logger.verbose("Lambda up and running...")
                successCallback()
            }
        })

        this.samLocalProcess.stdout.on('data', (data) => {
            logger.info(data)
        })
    }

    async setupLambda(){
        await this.pullLambdaContainer()

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
            logger.verbose("Search for dynamoDB container found...")
            logger.verbose(containers)
    
            if (containers.length > 0){
                logger.info("removing dynamoDB container...")
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
            logger.verbose("Search for local network found...")
            let networks = await docker.listNetworks({filters: {"name":["local-dev"]} })
            logger.verbose(networks)
            if (networks.length > 0){
                logger.info("removing local-dev network")
                var localNetwork = docker.getNetwork(networks[0].Id)
                await localNetwork.remove()
                logger.verbose("Local network removed")
            }
            else
            {
                logger.verbose("No local network found")
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
