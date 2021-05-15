import {config, DynamoDB} from 'aws-sdk'

config.update({region: 'us-east-1'});

export class DynamoDBFactory{
    static create() {    
        if (process.env.DYNAMODB_ENDPOINT != "null")
        {
            config.update({region: 'us-east-1'});
        }

        return new DynamoDB.DocumentClient()
    }
}
