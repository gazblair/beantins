// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

async function isRegistered(userId) {

  var params = {
      ExpressionAttributeValues: {
        ':userId' : userId
      },
      KeyConditionExpression: 'userId = :userId',
      TableName: "Chat_RegisteredUsers"
  }

  let userRegistered = false
  try{
      let result = await ddb.query(params).promise()
      userRegistered = result.Count > 0
  }
  catch(err){
      console.log(JSON.stringify(err))
  }
 
  return (userRegistered)
}

async function registerUserAsOnline(userId, connectionId)
{
  const userRecord = {
    TableName: process.env.ONLINE_USERS_TABLE_NAME,
    Item: {
      userId: userId,
      connectionId: connectionId
    }
  };

  console.log("register user as online - " + JSON.stringify(userRecord))
    
    await ddb.put(userRecord).promise()
}

// authenticate
 exports.handler = async event => {
  httpResponseCode = 403
  console.log("Connecting...")
  try {
    if (await isRegistered(event.queryStringParameters.userId)) {
    
      console.log("Is Registered")
      await registerUserAsOnline("1234", event.requestContext.connectionId)
        httpResponseCode = 200
    }

  } catch (err) {
    console.log("error" + JSON.stringify(err))
    httpResponseCode = 500
  }

  return {statusCode: httpResponseCode}
};
