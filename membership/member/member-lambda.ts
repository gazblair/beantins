import {MemberControllerFactory} from './application/member-controller-factory'
import { APIGatewayEvent, Context } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent, context: Context) => { 
    let result
    try {
        console.log("Received event:" + JSON.stringify(event))

        switch(event.path)
        {
            case "/signup-member/":
                if (event.body == null)
                {
                    result = {'statusCode': 404 }
                    throw new Error("HTTP event body is null")
                }
                let signupMemberDTO = JSON.parse(event.body)

                let memberController = MemberControllerFactory.create()
                result = memberController.signup(signupMemberDTO)
                break
            default:
                console.log("Unknown event")
                result = {'statusCode': 404 }
        }        
    }
    catch(err) {
        console.log("error occurred during signup" + err.message)
    }

    return result
}