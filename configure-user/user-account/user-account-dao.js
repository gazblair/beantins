"use strict"

const dynamodbfactory = require('./dynamodb-factory');

class UserAccountDAO {
    constructor(tableSuffix){
        this.dynamoDB = dynamodbfactory.create()

        this.tableSuffix = tableSuffix
    }

    buildTableName(){
        return "UserAccounts_" + this.tableSuffix
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
            let result = await this.dynamoDB.query(params).promise()
            phoneExists = result.Count > 0
        }
        catch(err){
            console.log(JSON.stringify(err))
        }
       
        return (phoneExists)
    }

    register(name, phone) {
        let tableentry = this.buildTableEntry(name, phone)

        return this.dynamoDB.put(tableentry).promise();
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
    UserAccountDAO: UserAccountDAO
}