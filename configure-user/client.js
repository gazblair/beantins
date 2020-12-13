const request = require('request')
const util = require('util')
const WebSocket = require('ws')

const registrationUrlRoot = process.env.REGISTRATION_URL_ROOT 
const chatUrlRoot = process.env.CHAT_URL_ROOT

async function signupUser(name, phone, callback)
{
    requestBody = {}
    requestBody.name = name

    if (phone) {
        requestBody.phone = phone
    }
          
    const options = {
        uri: registrationUrlRoot + 'signup-user/',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);
    callback(response);
}

module.exports = { signupUser };
