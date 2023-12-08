// Lambda defaults
locals {
  lambda_artifacts_base_path = trimsuffix(coalesce(var.lambda_artifacts_base_path, "${path.module}/../api/dist/zipballs"), "/")
  datadog_lambda_handler     = "/opt/nodejs/node_modules/datadog-lambda-js/handler.handler"
  datadog_lambda_custom_tags = {
    "git.repository_url" = var.git_repository_url
    "git.commit.sha"     = var.git_commit_sha
  }
  datadog_extension_layer_arn = join(":", [
    "arn",
    data.aws_partition.current.id,
    "lambda",
    data.aws_region.current.name,
    { aws = "464622532012", aws-us-gov = "002406178527" }[data.aws_partition.current.id],
    "layer",
    format("Datadog-Extension%s", var.lambda_arch == "arm64" ? "-ARM" : ""),
    var.datadog_lambda_extension_version,
  ])
  datadog_tracer_layer_arn = join(":", [
    "arn",
    data.aws_partition.current.id,
    "lambda",
    data.aws_region.current.name,
    { aws = "464622532012", aws-us-gov = "002406178527" }[data.aws_partition.current.id],
    "layer",
    "Datadog-Node18-x",
    var.datadog_lambda_tracer_version,
  ])
  lambda_default_environment_variables = merge(
    !var.datadog_enabled ? {} : merge(
      {
        DD_API_KEY_SECRET_ARN        = data.aws_ssm_parameter.datadog_api_key_secret_arn[0].value
        DD_APM_ENABLED               = "true"
        DD_CAPTURE_LAMBDA_PAYLOAD    = "false"
        DD_COMMIT_SHA                = var.git_commit_sha
        DD_ENV                       = var.environment
        DD_GIT_REPOSITORY_URL        = var.git_repository_url
        DD_SERVERLESS_APPSEC_ENABLED = "true"
        DD_SERVICE                   = "cpf-reporter"
        DD_SITE                      = "datadoghq.com"
        DD_TAGS                      = join(",", sort([for k, v in local.datadog_lambda_custom_tags : "${k}:${v}"]))
        DD_TRACE_ENABLED             = "true"
        DD_VERSION                   = var.version_identifier
      },
      // Allow variable-defined unified service tags and env vars to override the above defaults
      var.datadog_reserved_tags,
      var.datadog_default_environment_variables,
    ),
    {
      LOG_LEVEL = var.lambda_log_level
      TZ        = "UTC"
    },
  )
  lambda_default_execution_policies = compact([
    try(data.aws_iam_policy_document.read_datadog_api_key_secret[0].json, ""),
  ])
  lambda_layer_arns = compact([
    var.datadog_enabled ? local.datadog_extension_layer_arn : "",
    var.datadog_enabled ? local.datadog_tracer_layer_arn : "",
  ])
}

data "aws_iam_policy_document" "read_datadog_api_key_secret" {
  count = var.datadog_enabled ? 1 : 0

  statement {
    sid       = "GetDatadogAPIKeySecretValue"
    effect    = "Allow"
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [data.aws_ssm_parameter.datadog_api_key_secret_arn[0].value]
  }
}

module "lambda_security_group" {
  source  = "cloudposse/security-group/aws"
  version = "2.2.0"
  context = module.this.context

  vpc_id           = data.aws_ssm_parameter.vpc_id.value
  attributes       = ["lambda"]
  allow_all_egress = true

  create_before_destroy = true
}

module "lambda_artifacts_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  version = "4.0.1"
  context = module.s3_label.context
  name    = "lambda_artifacts"

  acl                          = "private"
  versioning_enabled           = true
  sse_algorithm                = "AES256"
  allow_ssl_requests_only      = true
  allow_encrypted_uploads_only = true
  source_policy_documents      = []

  lifecycle_configuration_rules = [
    {
      enabled                                = true
      id                                     = "rule-1"
      filter_and                             = null
      abort_incomplete_multipart_upload_days = 7
      transition                             = [{ days = null }]
      expiration                             = { days = null }
      noncurrent_version_transition = [
        {
          noncurrent_days = 30
          storage_class   = "GLACIER"
        },
      ]
      noncurrent_version_expiration = {
        noncurrent_days = 90
      }
    }
  ]
}

resource "aws_s3_object" "lambda_artifact-graphql" {
  bucket                 = module.lambda_artifacts_bucket.bucket_id
  key                    = "graphql.${filemd5("${local.lambda_artifacts_base_path}/graphql.zip")}.zip"
  source                 = "${local.lambda_artifacts_base_path}/graphql.zip"
  source_hash            = filemd5("${local.lambda_artifacts_base_path}/graphql.zip")
  etag                   = filemd5("${local.lambda_artifacts_base_path}/graphql.zip")
  server_side_encryption = "AES256"
}

module "lambda_function-graphql" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  function_name = "${var.namespace}-graphql"
  description   = "GraphQL API server for the CPF Reporter service."

  vpc_subnet_ids = local.private_subnet_ids
  vpc_security_group_ids = [
    module.lambda_security_group.id,
    module.postgres.security_group_id,
  ]
  attach_network_policy             = true
  role_permissions_boundary         = local.permissions_boundary_arn
  attach_cloudwatch_logs_policy     = true
  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  attach_policy_jsons               = true
  number_of_policy_jsons            = length(local.lambda_default_execution_policies)
  policy_jsons                      = local.lambda_default_execution_policies
  attach_policy_statements          = true
  policy_statements = {
    PostgresIAMAuth = {
      effect    = "Allow"
      actions   = ["rds-db:connect"]
      resources = ["${local.postgres_rds_connect_resource_base_arn}/${module.postgres.cluster_master_username}"]
    }
    GetPostgresSecret = {
      effect    = "Allow"
      actions   = ["ssm:GetParameters", "ssm:GetParameter"]
      resources = [aws_ssm_parameter.postgres_master_password.arn]
    }
    DecryptPostgresSecret = {
      effect    = "Allow"
      actions   = ["kms:Decrypt"]
      resources = [data.aws_kms_key.ssm.arn]
    }
  }

  handler       = var.datadog_enabled ? local.datadog_lambda_handler : "graphql.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_arch]
  publish       = true
  layers        = local.lambda_layer_arns

  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-graphql.bucket
    key    = aws_s3_object.lambda_artifact-graphql.key
  }

  timeout     = 25  # seconds (API Gateway limit is 30 seconds)
  memory_size = 512 # MB
  environment_variables = merge(local.lambda_default_environment_variables, {
    // Function-specific environment variables go here:
    DATABASE_URL = format(
      "postgres://%s@%s:%s/%s?%s",
      module.postgres.cluster_master_username,
      module.postgres.cluster_endpoint,
      module.postgres.cluster_port,
      module.postgres.cluster_database_name,
      join("&", [
        "sslmode=verify",
        "connection_limit=1", // Can be tuned for parallel query performance: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#serverless-environments-faas
      ])
    )
    DATABASE_SECRET_SOURCE             = "ssm"
    DATABASE_SECRET_SSM_PARAMETER_PATH = aws_ssm_parameter.postgres_master_password.name
    DD_LAMBDA_HANDLER                  = "graphql.handler"
  })

  allowed_triggers = {
    APIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*/graphql"
    }
  }
}
