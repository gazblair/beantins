"use strict"

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});
var AWS = require('aws-sdk');
const logger=require('../test/logger')

class RemoteTestSession {

    retrieveTemplateFile(){
        let templateFile = "output.yaml"
        if (process.env.SAM_TEMPLATE_FILE != "null"){
            templateFile = process.env.SAM_TEMPLATE_FILE
        }   
        return templateFile  
    }

    retrieveStackName(){
        let stackName = "messenger"
        if (process.env.SAM_STACK_NAME != "null"){
            stackName = process.env.SAM_STACK_NAME
        }   
        return stackName  
    }

    invokeLambda(successCallback, errorCallback) {

        const { spawn } = require('child_process');

        logger.info("Deploying lambda...")
        let samLocalProcess = spawn("sam", 
        ["deploy", 
        "--template-file",
        this.retrieveTemplateFile(),
        "--stack-name",
        this.retrieveStackName(),
        "--capabilities",
        "CAPABILITY_IAM",
        "--no-fail-on-empty-changeset"])
          
        samLocalProcess.stderr.on('data', (data) => {
            logger.info(data)
        })

        samLocalProcess.stdout.on('data', (data) => {
            logger.info(data)
        })

        samLocalProcess.on('exit', function(code) {
            if (code == 0){
                logger.error("Lambda deployed")
                successCallback()
            }
            else{
                logger.error("Lambda deploy failed with code - " + code)
                errorCallback()
            }
          })
    }

    async deployLambda(){
        return new Promise((resolve, reject) => {
            this.invokeLambda((successResponse) => {
                resolve();
            }, (errorResponse) => {
                reject()
            })
        })
    }

    async start(){
        await this.deployLambda()
    }

    async stop(){
    }
}

module.exports = {
    RemoteTestSession: RemoteTestSession
}
