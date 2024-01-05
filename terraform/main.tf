provider "aws" {
  default_tags {
    tags = {
      env        = var.environment
      management = "terraform"
      owner      = "grants"
      repo       = "cpf-reporter"
      service    = "cpf-reporter"
      usage      = "workload"
    }
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
  default_tags {
    tags = {
      env        = var.environment
      management = "terraform"
      owner      = "grants"
      repo       = "cpf-reporter"
      service    = "cpf-reporter"
      usage      = "workload"
    }
  }
}

provider "datadog" {
  validate = var.datadog_api_key != "" && var.datadog_app_key != "" ? true : false
  api_key  = var.datadog_api_key
  app_key  = var.datadog_app_key
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_partition" "current" {}

data "aws_ssm_parameter" "vpc_id" {
  name = "${var.ssm_deployment_parameters_path_prefix}/network/vpc_id"
}

data "aws_ssm_parameter" "private_subnet_ids" {
  name = "${var.ssm_deployment_parameters_path_prefix}/network/private_subnet_ids"
}

data "aws_kms_key" "ssm" {
  key_id = "alias/aws/ssm"
}

locals {
  private_subnet_ids       = split(",", data.aws_ssm_parameter.private_subnet_ids.value)
  permissions_boundary_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${var.permissions_boundary_policy_name}"
  datadog_draft_label      = var.datadog_draft ? "(Draft - ${var.environment})" : ""
}

data "aws_ssm_parameter" "public_dns_zone_id" {
  name = "${var.ssm_deployment_parameters_path_prefix}/dns/public_zone_id"
}

data "aws_ssm_parameter" "datadog_api_key_secret_arn" {
  count = var.datadog_enabled ? 1 : 0

  name = "${var.ssm_deployment_parameters_path_prefix}/datadog/api_key_secret_arn"
}

data "aws_ssm_parameter" "passage_api_key_secret_arn" {
  name = "${var.ssm_deployment_parameters_path_prefix}/passage/api_key_secret_arn"
}

module "this" {
  source  = "cloudposse/label/null"
  version = "0.25.0"

  namespace = var.namespace
}

module "s3_label" {
  source  = "cloudposse/label/null"
  version = "0.25.0"

  context = module.this.context
  attributes = [
    data.aws_caller_identity.current.account_id,
    data.aws_region.current.name,
  ]
}
