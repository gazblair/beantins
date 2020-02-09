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

        console.log("here's the event:")
        console.log(JSON.stringify(event))

        switch(event.path)
        {
            case "/api/login-user/":
                console.log("prepare to login")
                result = await registeredUsers.loginUser(user.name, user.phone)
                break
            case "/api/signup-new-user/":
                result = await registeredUsers.signUpNewUser(user.name, user.phone)
                break
        }        
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


