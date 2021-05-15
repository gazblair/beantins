import { DocumentClient } from "aws-sdk/clients/dynamodb"
import {MemberRepositoryDynamo} from "../member-repository-dynamo"
import {MemberRepository} from "../../domain/models/member-repository"
import "jest-dynalite/withDb"

const dynamoDB = new DocumentClient({
  convertEmptyValues: true,
  endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
  sslEnabled: false,
  region: "local",
});

let memberRepository: MemberRepository

beforeEach(() => {
  memberRepository = new MemberRepositoryDynamo(dynamoDB, "Dev")
});

test('when member is not registered then they are reported as such', async () => {

  const isRegistered = await memberRepository.existsWithEmail('bob@gmail.com')

  expect(isRegistered).toBe(false);
});

test('when member is registered then they are reported as such', async () => {
   await dynamoDB.put({TableName: 'Member_Dev', Item: {Email: "bob@gmail.com"}}).promise()

   const isRegistered = await memberRepository.existsWithEmail('bob@gmail.com')

   expect(isRegistered).toBe(true);
});

test('when table is non existent then log error', async () => {

  memberRepository = new MemberRepositoryDynamo(dynamoDB, "Unknown")
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  const isRegistered = await memberRepository.existsWithEmail('bob@gmail.com')
  
  expect(isRegistered).toBe(false)
  expect(consoleLogSpy.mock.calls[0][0]).toEqual(expect.stringContaining('Failed to query table for email bob@gmail.com because of error: Requested resource not found'))

  consoleLogSpy.mockRestore()
});  
