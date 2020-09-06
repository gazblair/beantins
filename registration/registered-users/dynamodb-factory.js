"use strict"

const AWS = require(`aws-sdk`);
AWS.config.update({region: 'us-east-1'});

function create() {    

    if (process.env.DYNAMODB_ENDPOINT != "null")
    {
        AWS.config.update({region: 'us-east-1', endpoint: process.env.DYNAMODB_ENDPOINT});
    }

    return new AWS.DynamoDB.DocumentClient()
}

module.exports = {
    create: create
}