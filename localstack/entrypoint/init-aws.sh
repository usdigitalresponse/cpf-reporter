#! /bin/bash

export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"

VALID_EMAILS=(
  "grants-identification@usdigitalresponse.org"
)

for email in "${VALID_EMAILS[@]}"; do
  awslocal ses verify-email-identity --email-address ${email}
  echo "Verified ${email} to send with localstack SES"
done

awslocal s3api create-bucket --bucket cpf-reporter --region us-west-2 --create-bucket-configuration '{"LocationConstraint": "us-west-2"}'

awslocal lambda create-function \
  --function-name localstack-js-lambda-example \
  --runtime nodejs16.x \
  --zip-file fileb:///tmp/function.zip \
  --handler index.handler \
  --role arn:aws:iam::000000000000:role/lambda-role

awslocal lambda create-function \
  --function-name localstack-py-lambda-example \
  --runtime python3.9 \
  --zip-file fileb:///tmp/function_py.zip \
  --handler sample_lambda.lambda_handler \
  --role arn:aws:iam::000000000000:role/lambda-role

#
# The js lambdas can be a bit tricky for inputs,
# so instead we use two python lambdas strung together
#
awslocal stepfunctions create-state-machine \
  --name "run-sample-functions" \
  --definition '{
    "Comment": "Invoke Two Lambda Functions",
    "StartAt": "Lambda1",
    "States": {
        "Lambda1": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "Parameters": {
                "FunctionName": "localstack-py-lambda-example",
                "Payload": {
                    "input.$": "$"
                }
            },
            "OutputPath": "$.Payload",
            "Next": "InvokeLambda"
        },
        "InvokeLambda": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke",
            "Parameters": {
                "FunctionName": "localstack-py-lambda-example",
                "Payload": {
                    "input.$": "$"
                }
            },
            "OutputPath": "$.Payload",
            "End": true
        }
    }
  }' \
  --role-arn "arn:aws:iam::000000000000:role/stepfunctions-role"

