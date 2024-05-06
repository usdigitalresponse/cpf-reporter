#! /bin/bash
set -x

export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"

apt install -y jq

VALID_EMAILS=(
  "grants-identification@usdigitalresponse.org"
)

for email in "${VALID_EMAILS[@]}"; do
  awslocal ses verify-email-identity --email-address ${email}
  echo "Verified ${email} to send with localstack SES"
done

awslocal configure set region us-west-2

## create terraform state bucket
awslocal s3api create-bucket --bucket cpf-reporter --region us-west-2 --create-bucket-configuration '{"LocationConstraint": "us-west-2"}'

## create terraform lock table
awslocal dynamodb create-table --table-name tf-test-state --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

## VPC setup
VPC_ID=$(awslocal ec2 create-vpc --cidr-block 10.1.0.0/16 --output json | jq -r '.Vpc.VpcId')
## create private subnets in that VPC and store the ID in an env var
PRIVATE_SUBNET_ID=$(awslocal ec2 create-subnet --vpc-id ${VPC_ID} --cidr-block 10.1.1.0/24 --availability-zone us-west-2a --output json | jq -r '.Subnet.SubnetId')
## dummy security group
awslocal ec2 create-security-group --group-name "dummy" --description "dummy" --vpc-id ${VPC_ID}

## Route53 zone
ZONE_ID=$(awslocal route53 create-hosted-zone --name "local.usdigitalresponse.org" --caller-reference 1  | jq -r '.HostedZone.Id' | cut -d'/' -f3)

## other SSM stuff
awslocal ssm put-parameter --name "/localstack/passage/api_key_secret_arn" --value "arn:aws:secretsmanager:us-west-2:000000000000" --type "String" --overwrite
awslocal ssm put-parameter --name "/localstack/network/vpc_id" --value "${VPC_ID}" --type "String" --overwrite
awslocal ssm put-parameter --name "/localstack/network/private_subnet_ids" --value "${PRIVATE_SUBNET_ID}" --type "String" --overwrite
awslocal ssm put-parameter --name "/localstack/dns/public_zone_id" --value "${ZONE_ID}" --type "String" --overwrite
