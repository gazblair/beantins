import {MemberRepositoryDynamo} from '../infrastructure/member-repository-dynamo'
import {DynamoDBFactory} from '../infrastructure/dynamodb-factory'
import {MemberService} from './member-service'
import {MemberController} from './member-controller'

export class MemberControllerFactory {   

    static create()
    {
        let tableSuffix: string 
        if (process.env.AWS_STAGE == null)
        {
            throw new Error("No AWS stage defined")
        }
        tableSuffix = process.env.AWS_STAGE
        let memberRepository = new MemberRepositoryDynamo(DynamoDBFactory.create(), tableSuffix)
        let memberService = new MemberService(memberRepository)
        let memberController = new MemberController(memberService)
        return memberController
    }
}

