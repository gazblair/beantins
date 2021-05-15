import {Member} from '../domain/models/member'
import {MemberRepository} from '../domain/models/member-repository'
import {DynamoDB} from 'aws-sdk'

export class MemberRepositoryDynamo implements MemberRepository{
    private dynamoDB: DynamoDB.DocumentClient
    private tableSuffix: string   
    
    constructor(dynamoDB: DynamoDB.DocumentClient, tableSuffix: string){
        this.dynamoDB = dynamoDB
        this.tableSuffix = tableSuffix
    }

    buildTableName(){
        return "Member_" + this.tableSuffix
    }
    
    async existsWithEmail(email: string) {
        var params = {
            ExpressionAttributeValues: {
              ':Email' : email
            },
            KeyConditionExpression: 'Email = :Email',
            TableName: this.buildTableName()
        }

        let memberExists = false
        try{
            let result = await this.dynamoDB.query(params).promise()
            memberExists = (result.Count != null) && result.Count > 0
            console.log("Found a match")
        }
        catch(err){
            console.log("Failed to query table for email " + email + " because of error: " + err.message)
        }
       
        return (memberExists)
    }

    async save(member: Member) {
        let tableentry = this.buildTableEntry(member)

        try{
            await this.dynamoDB.put(tableentry).promise()
        }
        catch(err){
            console.log("Failed to save to table for email " + member.email + " because of error: " + err.message)
        }
    }

    buildTableEntry(member: Member){
        const TableName = this.buildTableName()
        const Item: any = {}
        Item["Email"] = member.email
        Item["Name"] = member.name
        Item["JoinDate"] = member.joinDate
        Item["MemberId"] = member.id

        return {TableName, Item}
    }
}
