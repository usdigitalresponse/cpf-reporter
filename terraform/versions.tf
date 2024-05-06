terraform {
  required_version = "1.6.4"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.42.0"
    }
    datadog = {
      source  = "DataDog/datadog"
      version = "~> 3.38.0"
    }
    http = {
      source  = "hashicorp/http"
      version = "3.4.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.0"
    }
  }

  backend "s3" {
    bucket                      = "localstack"
    key                         = "localstack"
    region                      = "eu-west-1"
    use_path_style              = true
    skip_metadata_api_check     = false
    skip_credentials_validation = true
    iam_endpoint                = "http://localhost:4566"
    sts_endpoint                = "http://localhost:4566"
    endpoints = {
      s3 = "http://s3.localhost.localstack.cloud:4566"
    }
  }
}
