import {Member} from '../member'
import {MemberRepository} from '../member-repository'
import {SignupMemberService} from '../signup-member-service'
import {InvalidSignup} from '../invalid-signup'
import {MemberCreatedEvent} from '../member-created-event'
import {mock, MockProxy} from 'jest-mock-extended'

let memberRepository: MockProxy<MemberRepository>
let signupMemberService: SignupMemberService

test('given a member already exist then throw exception', () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(true)}))

  let member = new Member("bob@hotmail.com", "bob")
  
  expect(async() => {await signupMemberService.signup(member)}).rejects.toThrow(new InvalidSignup('existing member cannot be signed up again'))
})

test('given a member does not exist then signup', async() => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let member = new Member("bob@hotmail.com", "bob")

  await signupMemberService.signup(member)
    
  expect(member.events.length).toBe(1);
  expect((member.events[0] as MemberCreatedEvent).email).toBe("bob@hotmail.com");
  })

beforeEach(() => {
  memberRepository = mock<MemberRepository>();
  signupMemberService = new SignupMemberService(memberRepository)
})

  
  