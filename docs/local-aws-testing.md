# Testing Functions that Use AWS Locally

Below are tips and tricks for getting LocalStack up and running for testing AWS resources, as well as function specific instructions.

## Install necessary AWS CLI tools
First, install awscli-local via whatever package manager you use (pip, brew, etc). See examples and thoughts on versioning [here](https://docs.localstack.cloud/user-guide/integrations/aws-cli/)
under "LocalStack AWS CLI"

## Pull LocalStack Docker image and start container
1. Make sure you have Docker running
2. Pull docker image `docker pull localstack/localstack`
3. Start LocalStack container in terminal `docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack`
4. Test that LocalStack is running -- you can go to `http://localhost:4566` in your browser and you should see positive-looking output in the terminal window where you started the LocalStack container
5. Ensure that you have the following in your `.env` file: `LOCALSTACK_HOSTNAME=localhost`

## To Test `processValidationJson`
_Note: Some of this process is less than optimal given that validation etc. doesn't run fully on uploads locally for volunteers. Process improvement ideas quite welcome!_
1. Ensure you have a cpf-reporter bucket `awslocal s3api create-bucket --bucket cpf-reporter`
2. Create an upload locally, and remember the organization ID, agency ID, reporting period ID and upload ID for your new upload

Two possibilities for the next step:
3. **Option 1** Create an upload in staging, and get the resulting validation JSON for it (you will need the help of a USDR employee here, and likely need to work quickly since the JSON is deleted from S3 once it processes)
**Option 2** Create an upload in staging and ask a USDR employee to query the `upload_validation` for its `results` JSON, then paste that into a JSON file
**IN EITHER CASE** Plop the JSON file in a place easily accessible from the CLI

4. Determine your upload key / copy it somewhere for easy access. It should be roughly:
/uploads/YOUR_ORGANIZATION_ID/YOUR_AGENCY_ID/YOUR_REPORTING_PERIOD_ID/YOUR_FILE_NAME.json --body PATH_TO_YOUR_TEST_JSON_FROM_STEP_3

5. Put the JSON file into your local S3 for retrieval
```
awslocal s3api put-object --bucket cpf-reporter --key YOUR_UPLOAD_KEY
```

6. Hit this URL for the function:
http://localhost:8911/processValidationJson?Records[0][s3][bucket][name]=cpf-reporter&Records[0][s3][object][key]=YOUR_UPLOAD_KEY

Prosper! 🎊
