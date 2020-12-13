const { Before, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')

const userTableName = "UserAccounts_Dev"
const assert = require('assert')
const client = require('../../client')
const dynamodbfactory = require('../../user-account/dynamodb-factory');
const sessionFactory = require('../../../test/session-factory')
const logger=require('../../../test/logger')

async function clearUsers()
{
    const queryTableName = {
        TableName: userTableName
    };
    var dynamoDB = dynamodbfactory.create()
    let items =  await dynamoDB.scan(queryTableName).promise()

    items.Items.forEach(async function(item) {

        var userRecord = {
            TableName: userTableName,
            Key: item
        };

        logger.verbose("Clearing user - " + JSON.stringify(userRecord))
        
        await dynamoDB.delete(userRecord).promise()
    })
} 

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
})

Before(function () {
    return clearUsers()
});


const timeoutInMilliseconds = 180 * 1000

// Can take some time on a fresh machine where docker image has to be pulled
BeforeAll({timeout: timeoutInMilliseconds}, function () {
     this.testSession = sessionFactory.create()

     return this.testSession.start()
});

AfterAll(function () {
     return this.testSession.stop()
});

Given('I am not registered', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'given';
});

Given('I have already registered as {} and my phone number is {}', function (name, phone) {
    let register = client.signupUser(name, phone, response => {
        logger.verbose("Signup user has response - " + JSON.stringify(response))
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
    let register = client.signupUser(this.name, this.phone, response => {
        logger.verbose("Signup user has response - " + response)        
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