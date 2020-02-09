const request = require('request')
const util = require('util')

const lambdaUrlRoot = 'https://4wl88pf8u1.execute-api.us-east-1.amazonaws.com/Prod/'
async function signupNewUser(name, phone, callback)
{
    requestBody = {}
    requestBody.name = name

    if (phone) {
        requestBody.phone = phone
    }
            
    const options = {
        uri: lambdaUrlRoot + 'api/signup-new-user/',
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
        uri: lambdaUrlRoot + 'api/login-user/',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);

    callback(response);
}

module.exports = { signupNewUser, loginUser };
