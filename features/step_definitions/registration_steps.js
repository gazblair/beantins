const { Before, BeforeAll, AfterAll, Given, When, Then } = require('cucumber')

const request = require('request')
const assert = require('assert')
const util = require('util')
const client = require('../../client.js')

Before('@pending', function(scenario, callback) {
    callback(null, 'pending')
});

BeforeAll(function () {
    server = require('../../server.js')
});

AfterAll(function () {
    server.close()
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
        this.message = response.body;
    });
    
    return register;
});


Then('I receive a {int} response code', function (responseCode) {
    assert.equal(responseCode, this.httpResponseCode)
    return 'then';
});

Then('I receive a message that my {}', function (message) {
    assert.equal(message, this.message)
    return 'then';
});