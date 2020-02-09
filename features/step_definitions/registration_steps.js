const { Before, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')

const userTableName = "Users_sam-test-1"
const request = require('request')
const assert = require('assert')
const util = require('util')
const client = require('../../client.js')
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var documentClient = new AWS.DynamoDB.DocumentClient();

async function clearUsers()
{
    const queryTableName = {
        TableName: userTableName
    };

    let scanResults = [];
    let items =  await documentClient.scan(queryTableName).promise()

    items.Items.forEach(async function(item) {

        var userRecord = {
            TableName: userTableName,
            Key: item
        };

        console.log(JSON.stringify(userRecord))
        
        await documentClient.delete(userRecord).promise()
    })
} 

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
})

Before(function () {
    return clearUsers()
});

BeforeAll(function () {
});

AfterAll(function () {
});

Given('I am not registered', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'given';
});

Given('I have already registered as {} and my phone number is {}', function (name, phone) {
    let register = client.registerUser(name, phone, response => {
        this.httpResponseCode = response.statusCode;
        this.message = response.body;
    });
    
    return register;
});

When('I enter my name as {}', function (name) {

    this.name = name
});

When('I enter my phone as {}', function (phone) {

    this.phone = phone
});

When('I register as a new user', function () {
    let register = client.registerUser(this.name, this.phone, response => {
        this.httpResponseCode = response.statusCode;
        this.message = response.body.message;
    });
    
    return register;
});


Then('I receive a {int} response code', function (responseCode) {
    assert.equal(this.httpResponseCode, responseCode)
    return 'then';
});

Then('I receive a message that my {}', function (message) {
    assert.equal(this.message, message)
    return 'then';
});