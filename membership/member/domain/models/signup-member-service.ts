import {InvalidSignup} from "./invalid-signup"
import {Member} from '../../domain/models/member'
import {MemberRepository} from '../../domain/models/member-repository'
export class SignupMemberService {

  private memberRepository

  constructor(memberRepository: MemberRepository) {
    this.memberRepository = memberRepository
  }

  async signup(member: Member) {
    if (await this.memberRepository.existsWithEmail(member.email))
    {
      throw new InvalidSignup('existing member cannot be signed up again');
    }

    member.signup()
  }
}
