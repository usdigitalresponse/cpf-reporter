#!/bin/bash

AWS_PAGER=""

# generate a random prefix for resources
RS_PREFIX=$(date +%s)
S3_BUCKET=${RS_PREFIX}-cpf-reporter
LAMBDA_ZIP_DIR=dist
LAMBDA_ZIP=lambda.zip
LAMBDA_HANDLER=src.functions.create_archive.handle
LAMBDA_NAME=${RS_PREFIX}-create-archive
# functions to run before the create archive
LAMBDA_HANDLER_PRE=src.functions.test_lambdas.pre_create_archive
LAMBDA_NAME_PRE=${RS_PREFIX}-pre-create-archive
TEST_ORG_ID=123
TEST_REPORTING_PERIOD_ID=456
TEST_KEY_PATH=treasuryreports/${TEST_ORG_ID}/${TEST_REPORTING_PERIOD_ID}/

# create the bucket
awslocal s3 mb s3://${S3_BUCKET}

# function to call ahead of time
LAMBDA_RESULT_PRE=$(awslocal lambda create-function --function-name ${LAMBDA_NAME_PRE} --runtime python3.11 --handler ${LAMBDA_HANDLER_PRE} --role arn:aws:iam::000000000000:role/irrelevant --zip-file fileb://${PWD}/${LAMBDA_ZIP_DIR}/${LAMBDA_ZIP})
echo ${LAMBDA_RESULT_PRE}
LAMBDA_ARN_PRE=$(echo ${LAMBDA_RESULT_PRE} | jq -r '.FunctionArn')
echo ${LAMBDA_ARN}

# create the lambda
#mkdir dist
#cd python && zip -r ${LAMBDA_ZIP} src/ && cd ..
#mv python/${LAMBDA_ZIP} ${LAMBDA_ZIP_DIR}/
LAMBDA_RESULT=$(awslocal lambda create-function --function-name ${LAMBDA_NAME} --runtime python3.11 --handler ${LAMBDA_HANDLER} --role arn:aws:iam::000000000000:role/irrelevant --zip-file fileb://${PWD}/${LAMBDA_ZIP_DIR}/${LAMBDA_ZIP} --environment Variables="{S3_BUCKET=${S3_BUCKET}}")
echo ${LAMBDA_RESULT}
LAMBDA_ARN=$(echo ${LAMBDA_RESULT} | jq -r '.FunctionArn')
echo ${LAMBDA_ARN}

touch ${RS_PREFIX}file1.csv
awslocal s3 cp ${RS_PREFIX}file1.csv s3://${S3_BUCKET}/${TEST_KEY_PATH}
rm ${RS_PREFIX}file1.csv

STEPFUNCTION_RESULT=$(awslocal stepfunctions create-state-machine \
  --name "run-sample-functions" \
  --definition "{
    \"Comment\": \"Invoke Through Step Function\",
    \"StartAt\": \"Parallel\",
    \"States\": {
      \"Parallel\" : {
        \"Type\" : \"Parallel\",
        \"Next\": \"CreateArchive\",
        \"Branches\" : [
            {
                \"StartAt\" : \"Generate Project 1A File\",
                \"States\" : {
                    \"Generate Project 1A File\" : {
                        \"Type\" : \"Task\",
                        \"Resource\": \"${LAMBDA_ARN_PRE}\",
                        \"OutputPath\" : \"$.Payload\",
                        \"Parameters\" : {
                            \"Payload.$\" : \"$\"
                        }
                    }
                }
            },
            {
                \"StartAt\" : \"Generate Project 2A File\",
                \"States\" : {
                    \"Generate Project 2A File\" : {
                        \"Type\" : \"Task\",
                        \"Resource\": \"${LAMBDA_ARN_PRE}\",
                        \"OutputPath\" : \"$.Payload\",
                        \"Parameters\" : {
                            \"Payload.$\" : \"$\"
                        }
                    }
                }
            }
            ]
        },
        \"CreateArchive\": {
            \"Type\": \"Task\",
            \"Resource\": \"${LAMBDA_ARN}\",
            \"OutputPath\": \"$.Payload\",
            \"Parameters\": {
                \"Payload.$\": \"$\"
            },
            \"End\": true
        }
      }
  }" \
      --role-arn "arn:aws:iam::000000000000:role/stepfunctions-role")
echo ${STEPFUNCTION_RESULT}


#sleep 5

# run step function
#ARN="arn:aws:states:us-east-1:000000000000:stateMachine:run-sample-functions"
#awslocal stepfunctions start-execution \
#    --state-machine-arn "${ARN}"

# describe the execution
#awslocal stepfunctions describe-execution \
#        --execution-arn "arn:aws:states:us-east-1:000000000000:execution:CreateAndListBuckets:bf7d2138-e96f-42d1-b1f9-41f0c1c7bc3e"

# Get the function logs
#awslocal logs tail /aws/lambda/${LAMBDA_NAME}

# check for the output in the bucket
#awslocal s3 ls s3://${S3_BUCKET}/${TEST_KEY_PATH}

# clean-up
#awslocal lambda delete-function --function-name ${LAMBDA_NAME}
#awslocal s3 rb s3://${S3_BUCKET} --force
