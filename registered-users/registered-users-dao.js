"use strict"

const AWS = require(`aws-sdk`);
AWS.config.update({region: `us-east-1`});
const dynamo = new AWS.DynamoDB.DocumentClient();

class RegisteredUsersDAO {
    constructor(tableSuffix){
        this.tableSuffix = tableSuffix
    }
    buildTableName(){
        return "Users_" + this.tableSuffix
    }
    async isRegistered(name, phone) {

        var params = {
            ExpressionAttributeValues: {
              ':phone' : phone
            },
            KeyConditionExpression: 'Phone = :phone',
            TableName: this.buildTableName()
        }

        let phoneExists = false
        try{
            let result = await dynamo.query(params).promise()
            phoneExists = result.Count > 0
        }
        catch(err){
            console.log(JSON.stringify(err))
        }
       
        return (phoneExists)
    }

    register(name, phone) {
        let tableentry = this.buildTableEntry(name, phone)

        return dynamo.put(tableentry).promise();
    }

    buildTableEntry(name, phone){
        const TableName = this.buildTableName()
        const Item = {}
        Item["Phone"] = phone
        Item["Name"] = name
        return {TableName, Item}
    }
}

module.exports = {
    RegisteredUsersDAO: RegisteredUsersDAO
}