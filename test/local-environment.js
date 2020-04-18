"use strict"

var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

// Stop dynamoDB container
docker.listContainers({filters: {"name":["local-dynamodb"]} }).then(function(containers) {
    console.log(containers)
    containers.forEach(function (containerInfo) {
        var container = docker.getContainer(containerInfo.Id)
        container.stop()
        .then(function (containerInfo){
            container.remove()
        })
        .then(function (resolve){
            console.log("removing network")
            var localNetwork = docker.getNetwork('local-dev')

            localNetwork.remove().then(function (resolve) {
                console.log("Resolved!")
                console.log(resolve)
            }, function (reject) {
                console.log("REJECTED!")
                console.log(reject)
        });
  })}
  , function(reject) {
    console.log("REJECTED!")
    console.log(reject)
})
})
