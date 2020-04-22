const { Before, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')

const userTableName = "Users_Dev"
const assert = require('assert')
const client = require('../../client.js')
const dynamodbfactory = require('../../registered-users/dynamodb-factory.js');
const localTestSession = require('../../test/local-test-session.js')

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

        console.log(JSON.stringify(userRecord))
        
        await dynamoDB.delete(userRecord).promise()
    })
} 

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
})

Before(function () {
    return clearUsers()
    
});

const timeoutInMilliseconds = 10 * 1000

BeforeAll({timeout: timeoutInMilliseconds}, function () {
    this.localTestSession = new localTestSession.LocalTestSession()

    return this.localTestSession.start()
});

AfterAll(function () {
    return this.localTestSession.stop()
});

Given('I am not registered', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'given';
});

Given('I have already registered as {} and my phone number is {}', function (name, phone) {
    let register = client.signupNewUser(name, phone, response => {
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
    let register = client.signupNewUser(this.name, this.phone, response => {
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