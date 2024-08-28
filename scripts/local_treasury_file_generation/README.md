Treasury Report Generation
Note: this requires creating a step function in localstack with the name `GenerateTreasuryReport`
Example command to create the step function:
Create a definition file that contains the step function definition as defined in `treasury_generation_step_function.tf`
awslocal stepfunctions create-state-machine --name GenerateTreasuryReport --definition file://./step-functions/GenerateTreasuryReport.json --role-arn "arn:aws:iam::000000000000:role/stepfunctions-role"

touch localTestLambda.js
zip localTestFunction.zip localTestLambda.js
zip localTestproject1ALambda.zip localTestproject1ALambda.js
zip localTestproject1BLambda.zip localTestproject1BLambda.js
zip localTestproject1CLambda.zip localTestproject1CLambda.js
zip localTestsubrecipientLambda.zip localTestsubrecipientLambda.js
zip localTestzipLambda.zip localTestzipLambda.js

awslocal lambda create-function \
    --function-name localstack-lambda-zip \
    --runtime nodejs18.x \
    --zip-file fileb://localTestzipLambda.zip \
    --handler localTestzipLambda.handler \
    --role arn:aws:iam::000000000000:role/lambda-role

awslocal lambda create-function \
    --function-name localstack-lambda-subrecipient \
    --runtime nodejs18.x \
    --zip-file fileb://localTestsubrecipientLambda.zip \
    --handler localTestsubrecipientLambda.handler \
    --role arn:aws:iam::000000000000:role/lambda-role

awslocal lambda create-function \
    --function-name localstack-lambda-project-1A \
    --runtime nodejs18.x \
    --zip-file fileb://localTestproject1ALambda.zip \
    --handler localTestproject1ALambda.handler \
    --role arn:aws:iam::000000000000:role/lambda-role


awslocal lambda create-function \
    --function-name localstack-lambda-project-1B \
    --runtime nodejs18.x \
    --zip-file fileb://localTestproject1BLambda.zip \
    --handler localTestproject1BLambda.handler \
    --role arn:aws:iam::000000000000:role/lambda-role


awslocal lambda create-function \
    --function-name localstack-lambda-project-1C \
    --runtime nodejs18.x \
    --zip-file fileb://localTestproject1CLambda.zip \
    --handler localTestproject1CLambda.handler \
    --role arn:aws:iam::000000000000:role/lambda-role

awslocal stepfunctions create-state-machine --name RunLocalFunctionTest --definition file://./localTestStepFunctionDefinition.json --role-arn "arn:aws:iam::000000000000:role/stepfunctions-role"
awslocal stepfunctions update-state-machine --state-machine-arn "arn:aws:states:us-west-2:000000000000:stateMachine:GenerateTreasuryReport" --definition file://./localTestStepFunctionDefinition.json
awslocal stepfunctions start-execution \
    --state-machine-arn "arn:aws:states:us-west-2:000000000000:stateMachine:RunLocalFunctionTest"
awslocal --region us-west-2 logs describe-log-streams --log-group-name "/aws/lambda/localstack-lambda-url-example" --order-by "LastEventTime" --descending
Copy the response and add it to this log-stream-name. Dont forget to escape the $ ith [$LATEST] to [\$LATEST]
awslocal logs get-log-events --log-group-name "/aws/lambda/localstack-lambda-url-example" --log-stream-name "2024/08/27/[\$LATEST]013b13b62b4ff8ec0b6699a92682bf33"
If needed you can replace the TREASURY_STEP_FUNCTION_ARN with the ARN of the step function you created:
    TREASURY_STEP_FUNCTION_ARN="arn:aws:states:us-west-2:000000000000:stateMachine:RunLocalFunctionTest"
