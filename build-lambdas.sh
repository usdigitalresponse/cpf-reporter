#!/usr/bin/env bash
# TODO where should this live?
# cribbed from the python-function-zips GH action
set -e

pushd python
docker run --platform linux/amd64 -ti -v $(pwd):/python python:3.12 /python/build-python-lambda.sh
popd
awslocal lambda update-function-code \
  --function-name localstack-cpfValidation \
  --zip-file fileb://$(pwd)/python/dist/zipballs/lambda.zip 
