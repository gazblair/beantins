"use strict"

const newuser = require('./newuser')

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

    const newUser = new newuser.NewUser()

    let result
    try {
        let params = JSON.parse(event.body)

        let name = params.name
        let phone = params.phone

        result = await newUser.register(name, phone)
    }
    catch(err) {
        console.log(JSON.stringify(err))
    }

    return result
}


