# Treasury Report Emailing testing in localstack

## Create a definition file that contains the lambda function definition
As found in `lambda_function-email-presigned-url`, defined in `treasury_generation_lambda_functions.tf`

1. create a zip with the lambda you want to test
```
./setup.sh
```

2. create the lambda in awslocal
```
awslocal lambda create-function \
    --function-name treasury-file-email \
    --runtime python3.12 \
    --zip-file fileb://sendTreasuryReportLambda.zip \
    --handler generate_presigned_url_and_send_email.handle \
    --role arn:aws:iam::000000000000:role/lambda-role
```
    1. If you need to update the lambda function after the fact...
    ```
    awslocal lambda update-function-code \
      --function-name treasury-file-email \
      --zip-file fileb://sendTreasuryReportLambda.zip
    ```

3. update the environment variables
```
awslocal lambda update-function-configuration \
  --function-name treasury-file-email \
  --environment "{\"Variables\": {\"AWS_REGION\":\"us-west-2\",\"AWS_ACCESS_KEY_ID\":\"test\",\"AWS_SECRET_ACCESS_KEY\":\"test\"}}"
```

4. Create the event source mapping
```
awslocal lambda create-event-source-mapping \
  --function-name treasury-file-email \
  --batch-size 1 \
  --event-source-arn arn:aws:sqs:us-west-2:000000000000:treasury-email-queue
```

5. Trigger the SQS message on the UI locally

6. Check the logs
```
LOG_STREAM_NAME=$(awslocal --region us-west-2 logs describe-log-streams --log-group-name "/aws/lambda/treasury-file-email" --order-by "LastEventTime" --descending | jq -r '.logStreams | first | .logStreamName')

awslocal logs get-log-events --log-group-name "/aws/lambda/treasury-file-email" --log-stream-name "$LOG_STREAM_NAME"
```
