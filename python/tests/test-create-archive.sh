#!/bin/bash

AWS_PAGER=""

# generate a random prefix for resources
RS_PREFIX=$(date +%s)
QUEUE_NAME=${RS_PREFIX}-my-queue
S3_BUCKET=${RS_PREFIX}-cpf-reporter
LAMBDA_HANDLER=src.functions.create_archive.handle
LAMBDA_ZIP=/Users/jakekreider/projects/cpf-reporter/python/dist/lambda.zip
LAMBDA_NAME=${RS_PREFIX}-create-archive
TEST_ORG_ID=123
TEST_REPORTING_PERIOD_ID=456
TEST_KEY_PATH=treasuryreports/${TEST_ORG_ID}/${TEST_REPORTING_PERIOD_ID}/

# Create an SQS queue
awslocal sqs create-queue --queue-name ${QUEUE_NAME}

# create the bucket
awslocal s3 mb s3://${S3_BUCKET}

# create the lambda
 awslocal lambda create-function --function-name ${LAMBDA_NAME} --runtime python3.12 --handler ${LAMBDA_HANDLER} --role arn:aws:iam::000000000000:role/irrelevant --zip-file fileb://${LAMBDA_ZIP} --environment Variables="{S3_BUCKET=${S3_BUCKET}}"

awslocal lambda create-event-source-mapping --function-name ${LAMBDA_NAME} --batch-size 1 --event-source-arn arn:aws:sqs:us-west-2:000000000000:${QUEUE_NAME} --starting-position LATEST

# Add fake files to the bucket
touch ${RS_PREFIX}file1.csv
awslocal s3 cp ${RS_PREFIX}file1.csv s3://${S3_BUCKET}/${TEST_KEY_PATH}
rm ${RS_PREFIX}file1.csv
# Send a message to the queue with fields org_id, reporting_period_id
awslocal sqs send-message --queue-url http://sqs.us-west-2.localhost.localstack.cloud:4566/000000000000/${QUEUE_NAME} --message-body "{\"org_id\": ${TEST_ORG_ID}, \"reporting_period_id\": ${TEST_REPORTING_PERIOD_ID}}"

sleep 5
# Get the function logs
awslocal logs tail /aws/lambda/${LAMBDA_NAME}

# check for the output in the bucket
awslocal s3 ls s3://${S3_BUCKET}/${TEST_KEY_PATH}

# clean-up 
awslocal lambda delete-function --function-name ${LAMBDA_NAME}
awslocal s3 rb s3://${S3_BUCKET} --force
awslocal sqs delete-queue --queue-url http://sqs.us-west-2.localhost.localstack.cloud:4566/000000000000/${QUEUE_NAME}
