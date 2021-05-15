import {Member} from '../domain/models/member'
import {MemberService} from './member-service'
import {InvalidEmailAddress} from '../domain/models/invalid-email-address'
import {InvalidName} from '../domain/models/invalid-name'
import {InvalidSignup} from '../domain/models/invalid-signup'
import {HttpResponse} from '../infrastructure/http-response'

export class MemberController {
  
    private memberService

    constructor(memberService: MemberService) {
      this.memberService = memberService
    }

    async signup(signupDTO: any) {

      let httpResponseCode = 201
      let message = "signup initiated"

      try
      {
         if (signupDTO.email == null)
         {
           throw new InvalidEmailAddress("cannot signup without an email")
         }

         if (signupDTO.name == null)
         {
           throw new InvalidName("cannot signup without a name")
         }
         
         let member = new Member(signupDTO.email, signupDTO.name)

         await this.memberService.signup(member)
      }
      catch(error)
      {
        httpResponseCode = 500
        
        if ((error instanceof InvalidEmailAddress) || 
            (error instanceof InvalidName)){
          httpResponseCode = 400
        }

        if (error instanceof InvalidSignup) {
          httpResponseCode = 409
        }

        message = error.message
      }

      return HttpResponse.build(httpResponseCode, message)
    }
}
