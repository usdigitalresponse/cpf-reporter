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
      version = "3.4.5"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.0"
    }
  }

  backend "s3" {}
}
