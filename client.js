const request = require('request')
const util = require('util')

const lambdaUrlRoot = process.env.LAMBDA_URL_ROOT 
async function signupNewUser(name, phone, callback)
{
    requestBody = {}
    requestBody.name = name

    if (phone) {
        requestBody.phone = phone
    }
          
    const options = {
        uri: lambdaUrlRoot + 'signup-new-user/',
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
        uri: lambdaUrlRoot + 'login-user/',
        method: 'POST',
        json: requestBody
    }

    const requestPromise = util.promisify(request);
    const response = await requestPromise(options);

    callback(response);
}

module.exports = { signupNewUser, loginUser };
