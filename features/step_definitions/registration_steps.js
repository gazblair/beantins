const { Before, After, Given, When, Then } = require('cucumber')

const request = require('request')
const assert = require('assert')
const util = require('util')

Before(function () {
    server = require('../../servepage.js')
});

After(function () {
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

Then('I receive acknowledgement that my account was created', function () {
    assert.equal(this.httpResponseCode, 201)
    return 'then';
});