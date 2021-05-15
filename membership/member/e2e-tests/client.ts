const fs = require('fs');
const got = require('got')
import logger from './logger'

export async function signupMember(name: string, email: string)
{
    let responseBody: any = {}
    let requestBody: any = {}
    requestBody.name = name

    if (email) {
        requestBody.email = email
    }

    try{
        const registrationUrlRoot = JSON.parse(fs.readFileSync('./e2e-tests/signup-lambda.json', 'utf8'))

        const url = registrationUrlRoot.Uri + "signup-member/"

        logger.verbose("Signup member at url - " + url)

        responseBody = await got.post(url, {
            json: requestBody,
            throwHttpErrors: false,
            responseType: 'json'
        })
        logger.verbose("Signup member response - " + responseBody.statusCode)
    }
    catch(error)
    {
        logger.verbose("Error from Signup post request - " + JSON.stringify(error))
    }

    return responseBody
}
