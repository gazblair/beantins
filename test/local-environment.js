"use strict"

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

async function cleanUpDynamoDB(){
    try{
        let containers = await docker.listContainers({filters: {"name":["local-dynamodb"]} })
        console.log("Search for dynamoDB container found...")
        console.log(containers)

        if (containers.length == 1){
            console.log("removing dynamoDB container")
            var container = docker.getContainer(containers[0].Id)
            await container.stop()
            await container.remove()
        }
    }
    catch(error){
        console.log(error)
    }
}

async function cleanUpLocalNetwork(){
    try{
        console.log("Search for local network found...")
        let networks = await docker.listNetworks({filters: {"name":["local-dev"]} })
        console.log(networks)
        if (networks.length == 1){
            console.log("removing local-dev network")
            var localNetwork = docker.getNetwork(networks[0].Id)
            await localNetwork.remove()
        }
    }
    catch(error){
        console.log(error)
    }
}

async function CleanUp()
{
    await cleanUpDynamoDB()
    await cleanUpLocalNetwork()
}

CleanUp()

