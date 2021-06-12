# Serverless using AWS Lambda

### Create Serverless Project

sls create --template aws-nodejs-ecma-script --name auction-service --path auction-service

### AWS Cloudformation

Link : https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html

This links defines what would be the result once the resource is created via cloud formation. These return values can then be used in the serverless.yaml for optimization and for maintianing environment/ custom variables

### Deploy Entire Service

sls deploy -v

### Deploy only a function

sls deploy -f functionName -v

### Invoke a function / trigger

sls invoke -f functionaName -l &nbsp;&nbsp; [ -l returns log]

### Tail logs

sls logs -f functionName -t &nbsp;&nbsp; [ -t refers to tailing]

sls logs -f functionaName --startTime 1m|1h &nbsp;&nbsp; [ --startTime returns only for last specified time]

### Curl Auth0

curl --location --request POST 'https://serverless-test-lambda.us.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=lNdTCJwbvuEIlYqCEqtS1WC8vsS13z4I' \
--data-urlencode 'username=dk@mailinator.com' \
--data-urlencode 'password=Passw0rd!@#' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'
