"use strict"

const registeredusers = require('./registered-users')

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

exports.handler = async (event) => {

    const registeredUsers = new registeredusers.RegisteredUsers()

    let result
    try {
        let user = JSON.parse(event.body)

        result = await registeredUsers.signUpNewUser(user.name, user.phone)
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


