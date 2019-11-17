const request = require('request')
const util = require('util')

async function registerUser(name, phone, callback)
{
    requestBody = {}
    requestBody.name = name

    if (phone) {
        requestBody.phone = phone
    }
            
    const options = {
        uri: 'http://localhost:8081/api/register-user',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);

    callback(response);
}

async function loginUser(phone, callback)
{
    requestBody = {}

    if (phone) {
        requestBody.phone = phone
    }
    const options = {
        uri: 'http://localhost:8081/api/login-user',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);

    callback(response);
}

module.exports = { registerUser, loginUser };
