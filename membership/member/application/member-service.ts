import {Member} from '../domain/models/member'
import {MemberRepository} from '../domain/models/member-repository'
import {SignupMemberService} from '../domain/models/signup-member-service'

export class MemberService {

    private memberRepository

    constructor(memberRepository: MemberRepository) 
    {
      this.memberRepository = memberRepository
    }

    async signup(member: Member) {

      let signupMemberService = new SignupMemberService(this.memberRepository)

      await signupMemberService.signup(member)

      await this.memberRepository.save(member)

      // eventDispatcher = new EventDispatcher()
      // eventDispatcher.register(MemberCreatedEvent.name, emailNotificationHandler)

      //eventDispatcher.add(member.domainEvents)

      //eventDispatcher.dispatchAll()

    }
}
