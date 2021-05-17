const memberTableName = "Member_Dev"
import {DynamoDBFactory} from '../infrastructure/dynamodb-factory'
import logger from './logger'

import { StepDefinitions } from 'jest-cucumber';
import { signupMember } from './client';

let name: string | null
let email: string | null
let responseCode: number
let responseMessage: string

export const signupMemberSteps: StepDefinitions = ({ given, and, when, then }) => {

  given('I am not registered', () => {
    
  })

  given(/I have already signed up as (\w+) and my email is "([\w@.]+)"/, async (enteredName, enteredEmail)  => {
    await signupMember(enteredName, enteredEmail)
  })

  when(/I enter my name as (\w+)/, (enteredName: string) => {
    name = enteredName
  })
  
  when(/I enter my email as \"([\w@.]+)\"/, (enteredEmail: string) => {
    email = enteredEmail
  })
  
  when('I signup', async () => {
    logger.verbose("signup member " + name + " with email " + email)
    let response = await signupMember(name, email)
    if (response != null)
    {
      logger.verbose("responseCode - " + response.statusCode + ",message - " + response.body.message)
      responseCode = response.statusCode;
      responseMessage = response.body.message;
    }
  })
  
  then(/I receive a (\d+) response code/,  expectedResponseCode => {
    expect(responseCode).toBe(Number(expectedResponseCode));
  })

  then(/I receive the message "(.+)"/,  expectedResponseMessage => {
    expect(responseMessage).toBe(expectedResponseMessage);
  })

}

beforeEach(async () => {
  name = null
  email = null
  await clearMembers()
});

async function clearMembers()
{
  const queryTableName = {
      TableName: memberTableName
  }
  var dynamoDB = DynamoDBFactory.create()
  let items =  await dynamoDB.scan(queryTableName).promise()

  if (items.Items) {
    items.Items.forEach(async function(item) {

        var memberRecord = {
            TableName: memberTableName,
            Key: {"Name": item["Name"], "Email": item["Email"]}
        };

        logger.verbose("Clearing member - " + JSON.stringify(memberRecord))
        
        try
        {
            await dynamoDB.delete(memberRecord).promise()
        }
        catch(error)
        {
            logger.error("Failed to clear record from " + memberTableName + " - " + error)
        }
    })
  }
} 

