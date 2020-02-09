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
        uri: 'https://tca9ti1o2m.execute-api.us-east-1.amazonaws.com/Prod/api/registeruser/',
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
        uri: 'https://tca9ti1o2m.execute-api.us-east-1.amazonaws.com/Prod/api/loginuser/',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);

    callback(response);
}

module.exports = { registerUser, loginUser };
