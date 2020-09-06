const { Before, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')
const userTableName = "Users_Dev"
const request = require('request')
const assert = require('assert')
const util = require('util')
const client = require('../../client.js')
const logger=require('../../../test/logger.js')

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
});

BeforeAll(function () {
});

AfterAll(function () {
});

Given('I am not registered', function () {
    // Write code here that turns the phrase above into concrete actions
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
