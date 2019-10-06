const { BeforeAll, AfterAll, Given, When, Then } = require('cucumber')

const request = require('request')
const assert = require('assert')
const util = require('util')

BeforeAll(function () {
    server = require('../../servepage.js')
});

AfterAll(function () {
    server.close()
});

Given('I am not registered', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'given';
});

When('I enter my details and send the register request', function () {

    var getRequest = async() => {
        
        const options = {
            uri: 'http://localhost:8081/api/register-user',
            method: 'POST',
            json: {
              "name" : "Johab Morelli",
              "phone" : "+44 19023 45345"
            }
        }

        const requestPromise = util.promisify(request);
        const response = await requestPromise(options);

        this.httpResponseCode = response.statusCode
    }

    return getRequest();
});

When('I enter my name as {}', function (name) {

    this.name = name
});

When('I enter my phone as {}', function (phone) {

    this.phone = phone
});

When('I register as a new user', function () {

    requestBody = {}
    requestBody.name = this.name

    if (this.phone) {
        requestBody.phone = this.phone
    }


    var getRequest = async() => {
        
        const options = {
            uri: 'http://localhost:8081/api/register-user',
            method: 'POST',
            json: requestBody
        }

        const requestPromise = util.promisify(request);
        const response = await requestPromise(options);

        this.httpResponseCode = response.statusCode
        this.message = response.body
    }

    return getRequest();
});


Then('I receive a {int} response code', function (responseCode) {
    assert.equal(responseCode, this.httpResponseCode)
    return 'then';
});

Then('I receive a message that my {}', function (message) {
    assert.equal(message, this.message)
    return 'then';
});