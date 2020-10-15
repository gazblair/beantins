const { Before, After, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')
const registeredUsersTableName = "Chat_RegisteredUsers"
const onlineUsersTableName = "Chat_OnlineUsers"
const request = require('request')
const assert = require('assert')
const util = require('util')
const client = require('../../client.js')
const logger=require('../../../test/logger.js')

const dynamodbfactory = require('../../dynamodb-factory');
const { resolve } = require('path')

async function addUser(tableName, userId)
{
    var dynamoDB = dynamodbfactory.create()
    
    var userRecord = {
        TableName: tableName,
        Item:{ "userId": userId }
    };

    logger.verbose("Adding user - " + JSON.stringify(userRecord))
    
    await dynamoDB.put(userRecord).promise()
}

async function clearUsers(tableName)
{
    const queryTableName = {
        TableName: tableName
    };
    var dynamoDB = dynamodbfactory.create()
    let items =  await dynamoDB.scan(queryTableName).promise()

    items.Items.forEach(async function(item) {

        var userRecord = {
            TableName: tableName,
            Key: item
        };

        logger.verbose("Clearing user - " + JSON.stringify(userRecord))
        
        await dynamoDB.delete(userRecord).promise()
    })
}

async function clearAllTables()
{
    await clearUsers(registeredUsersTableName)
    await clearUsers(onlineUsersTableName)
}

async function isUserPresentInTable(tableName, userId) {
    var dynamoDB = dynamodbfactory.create()
    var params = {
        ExpressionAttributeValues: {
          ':userId' : userId
        },
        KeyConditionExpression: 'userId = :userId',
        TableName: tableName
    }
  
    logger.verbose("user - " + userId)
    logger.verbose("tableName - " + tableName)
    let userPresent = false
    try{
        let result = await dynamoDB.query(params).promise()
        userPresent = result.Count > 0
        logger.verbose("result - " + JSON.stringify(result))
    }
    catch(err){
        logger.verbose("table query failed - " + JSON.stringify(err))
    }
   
    return (userPresent)
  }

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
});

Before(function () {
    return clearAllTables()
});

After(function () {
    client.logoffUser("1234")
});

BeforeAll(function () {
});

AfterAll(function () {
});

Given('I am not registered', function () {
    return 'given';
});

Given('I am registered', function () {
    addUser(registeredUsersTableName, "1234");
    return 'given';
});

When('I attempt to login', function () {
    phone = "01467 234177"
    let login = client.loginUser(phone, responseCode => {
        logger.verbose("Login user has response - " + JSON.stringify(responseCode))

        this.httpResponseCode = responseCode
    });
    
    return login;
});

Then('I receive a {int} response code', function (responseCode) {
    assert.equal(this.httpResponseCode, responseCode)
    return 'then';
});

Then('I am online', async function () {

    assert.equal(await isUserPresentInTable(onlineUsersTableName, "1234"), true)
});

