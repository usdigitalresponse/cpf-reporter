#!/usr/bin/env bats

setup_file() {
  export AWS_PAGER=""
  export RS_PREFIX=$(date +%s) # random prefix for resources
  export QUEUE_NAME=${RS_PREFIX}-my-queue
  export S3_BUCKET=${RS_PREFIX}-cpf-reporter
  export LAMBDA_HANDLER=src.functions.create_archive.handle
  export LAMBDA_ZIP=/Users/jakekreider/projects/cpf-reporter/python/dist/lambda.zip
  export LAMBDA_NAME=${RS_PREFIX}-create-archive
  export TEST_ORG_ID=123
  export TEST_REPORTING_PERIOD_ID=456
  export TEST_KEY_PATH=treasuryreports/${TEST_ORG_ID}/${TEST_REPORTING_PERIOD_ID}/

  # Create an SQS queue
  awslocal sqs create-queue --queue-name ${QUEUE_NAME}

  # create the bucket
  awslocal s3 mb s3://${S3_BUCKET}
}

teardown_file() {
  awslocal lambda delete-function --function-name ${LAMBDA_NAME}
  awslocal s3 rb s3://${S3_BUCKET} --force
  awslocal sqs delete-queue --queue-url http://sqs.us-west-2.localhost.localstack.cloud:4566/000000000000/${QUEUE_NAME}
}

@test "Compile Lambda function" {
  /bin/bash ../python/build-lambda.bash
}

@test "Create Lambda function" {
  awslocal lambda create-function --function-name ${LAMBDA_NAME} --runtime python3.12 --handler ${LAMBDA_HANDLER} --role arn:aws:iam::000000000000:role/irrelevant --zip-file fileb://${LAMBDA_ZIP} --environment Variables="{S3_BUCKET=${S3_BUCKET}}"
}

@test "Create Lambda event source mapping" {
  awslocal lambda create-event-source-mapping --function-name ${LAMBDA_NAME} --batch-size 1 --event-source-arn arn:aws:sqs:us-west-2:000000000000:${QUEUE_NAME} --starting-position LATEST
}

@test "Send message to SQS queue" {
  touch ${RS_PREFIX}file1.csv
  awslocal s3 cp ${RS_PREFIX}file1.csv s3://${S3_BUCKET}/${TEST_KEY_PATH}
  rm ${RS_PREFIX}file1.csv
  run awslocal sqs send-message --queue-url http://sqs.us-west-2.localhost.localstack.cloud:4566/000000000000/${QUEUE_NAME} --message-body "{\"org_id\": ${TEST_ORG_ID}, \"reporting_period_id\": ${TEST_REPORTING_PERIOD_ID}}"
  [ "$status" -eq 0 ]
}

@test "Get Lambda function logs" {
  # echo the lambda name
  echo ${LAMBDA_NAME} # debugging
  # give the lambda a moment to run
  sleep 5
  run awslocal logs tail /aws/lambda/${LAMBDA_NAME}
  [ "$status" -eq 0 ]
}

@test "Check output in S3 bucket" {
  run awslocal s3 ls s3://${S3_BUCKET}/${TEST_KEY_PATH}
  [ "$status" -eq 0 ]
  # make sure report.zip is in output




}
