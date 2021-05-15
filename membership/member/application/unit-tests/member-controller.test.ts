import {MemberRepository} from '../../domain/models/member-repository'
import {MemberService} from '../member-service'
import {MemberController} from '../member-controller'
import {mock, MockProxy} from 'jest-mock-extended'

let memberRepository: MockProxy<MemberRepository>
let memberController: MemberController

test('when signing up new member without an email then signup rejected', async () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let result = await memberController.signup({ email: null, name: "Bob" })

  expect(result.statusCode).toBe(400)
  expect(result.body).toBe(JSON.stringify({"message": "cannot signup without an email"}))
})

test('when signing up new member with an invalid email then signup rejected', async () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let result = await memberController.signup({ email: "bobgmail.com", name: "Bob" })

  expect(result.statusCode).toBe(400)
  expect(result.body).toBe(JSON.stringify({"message": "invalid email format: bobgmail.com"}))
})

test('when signing up new member without a name then signup rejected', async () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let result = await memberController.signup({ email: "bob@gmail.com", name: null })

  expect(result.statusCode).toBe(400)
  expect(result.body).toBe(JSON.stringify({"message": "cannot signup without a name"}))
})

test('when signing up new member with an invalid name then signup rejected', async () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let result = await memberController.signup({ email: "bob@gmail.com", name: "1" })

  expect(result.statusCode).toBe(400)
  expect(result.body).toBe(JSON.stringify({"message": "name too short: 1"}))
})

test('when signing up new member with a name and email then signup accepted', async () => {

  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(false)}))

  let result = await memberController.signup({ email: "bob@gmail.com", name: "Bob" })

  expect(result.statusCode).toBe(201)
  expect(result.body).toBe(JSON.stringify({"message": "signup initiated"}))
})

test('given already signed up when signing up again then signup rejected', async () => {
  memberRepository.existsWithEmail.mockReturnValue(new Promise((resolve) => {
    resolve(true)}))
 
  let result = await memberController.signup({ email: "Bob@gmail.com", name: "Bob" })

  expect(result.statusCode).toBe(409)
  expect(result.body).toBe(JSON.stringify({"message": "existing member cannot be signed up again"}))
})

beforeEach(() => {
  memberRepository = mock<MemberRepository>();
  let memberService = new MemberService(memberRepository);
  memberController = new MemberController(memberService);
});