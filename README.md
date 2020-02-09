# nodetest
Schoolboy code

## AWS credentials
To be able to access the AWS lambda and DynamoDB, you must have the correct credentials and config given to you by your administrator.

These should be placed in your VM's persisted data area, in these directories:

{{ persistent_data_drive_mount_path }}/.aws/credentials
{{ persistent_data_drive_mount_path }}/.aws/config

You must create the .aws directory

aws configure

AWS Access Key ID [None]: **************
AWS Secret Access Key [None]: **************
Default region name [None]: us-east-1
Default output format [None]: json

This path is made available throught the environment variable:

AWS_SHARED_CREDENTIALS_FILE
AWS_CONFIG_FILE

(see main.yml under the AWS roles in the infrastructure directory)

copy the .aws directory to your home directory, and you should be able to run the lambda and access the dynamoDb in AWS.