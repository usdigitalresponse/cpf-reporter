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
      LOG_LEVEL                  = var.lambda_log_level
      REPORTING_DATA_BUCKET_NAME = module.reporting_data_bucket.bucket_id
      TZ                         = "UTC"
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

module "reporting_data_bucket" {
  source  = "cloudposse/s3-bucket/aws"
  version = "4.0.1"
  context = module.s3_label.context
  name    = "reporting_data"

  acl                          = "private"
  versioning_enabled           = true
  sse_algorithm                = "AES256"
  allow_ssl_requests_only      = true
  allow_encrypted_uploads_only = true
  source_policy_documents      = []

  cors_configuration = [
    {
      allowed_methods = ["GET", "HEAD", "POST", "PUT"]
      allowed_origins = [var.website_domain_name]
      allowed_headers = ["*"]
      expose_headers = [
        "Content-Disposition",
        "Content-Encoding",
        "Content-Length",
        "Content-Location",
        "Content-Range",
        "Date",
        "ETag",
        "Server",
        "x-amz-delete-marker",
        "x-amz-id-2",
        "x-amz-request-id",
        "x-amz-version-id",
        "x-amz-server-side-encryption",
      ]
      max_age_seconds = 300 // 5 minutes, in seconds
    },
  ]

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

resource "aws_s3_object" "lambda_artifact-excelToJson" {
  bucket                 = module.lambda_artifacts_bucket.bucket_id
  key                    = "excelToJson.${filemd5("${local.lambda_artifacts_base_path}/excelToJson.zip")}.zip"
  source                 = "${local.lambda_artifacts_base_path}/excelToJson.zip"
  source_hash            = filemd5("${local.lambda_artifacts_base_path}/excelToJson.zip")
  etag                   = filemd5("${local.lambda_artifacts_base_path}/excelToJson.zip")
  server_side_encryption = "AES256"
}

resource "aws_s3_object" "lambda_artifact-cpfValidation" {
  bucket                 = module.lambda_artifacts_bucket.bucket_id
  key                    = "cpfValidation.${filemd5("${local.lambda_artifacts_base_path}/cpfValidation.zip")}.zip"
  source                 = "${local.lambda_artifacts_base_path}/cpfValidation.zip"
  source_hash            = filemd5("${local.lambda_artifacts_base_path}/cpfValidation.zip")
  etag                   = filemd5("${local.lambda_artifacts_base_path}/cpfValidation.zip")
  server_side_encryption = "AES256"
}

resource "aws_s3_bucket_notification" "reporting_data" {
  bucket = module.reporting_data_bucket.bucket_id

  lambda_function {
    lambda_function_arn = module.lambda_function-excelToJson.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
    filter_suffix       = ".xlsm"
  }

  lambda_function {
    lambda_function_arn = module.lambda_function-cpfValidation.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "uploads/"
    filter_suffix       = ".xlsm.json"
  }
}

module "lambda_function-graphql" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-graphql"
  description   = "GraphQL API server for the CPF Reporter service."

  // Networking
  attach_network_policy = true
  vpc_subnet_ids        = local.private_subnet_ids
  vpc_security_group_ids = [
    module.lambda_security_group.id,
    module.postgres.security_group_id,
  ]

  // Permissions
  role_permissions_boundary         = local.permissions_boundary_arn
  attach_cloudwatch_logs_policy     = true
  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  attach_policy_jsons               = length(local.lambda_default_execution_policies) > 0
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
    GetPassageAPIKeySecretValue = {
      effect    = "Allow"
      actions   = ["secretsmanager:GetSecretValue"]
      resources = [data.aws_ssm_parameter.passage_api_key_secret_arn.value]
    }
  }

  // Artifacts
  publish        = true
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-graphql.bucket
    key    = aws_s3_object.lambda_artifact-graphql.key
  }

  // Runtime
  handler       = var.datadog_enabled ? local.datadog_lambda_handler : "graphql.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_layer_arns
  timeout       = 25  # seconds (API Gateway limit is 30 seconds)
  memory_size   = 512 # MB
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
    PASSAGE_API_KEY_SECRET_ARN         = data.aws_ssm_parameter.passage_api_key_secret_arn.value
  })

  // Triggers
  allowed_triggers = {
    APIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*/graphql"
    }
  }
}

module "lambda_function-excelToJson" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-excelToJson"
  description   = "Reacts to S3 events and converts Excel files to JSON."

  // Networking
  attach_network_policy  = false
  vpc_subnet_ids         = null
  vpc_security_group_ids = null

  // Permissions
  role_permissions_boundary         = local.permissions_boundary_arn
  attach_cloudwatch_logs_policy     = true
  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  attach_policy_jsons               = length(local.lambda_default_execution_policies) > 0
  number_of_policy_jsons            = length(local.lambda_default_execution_policies)
  policy_jsons                      = local.lambda_default_execution_policies
  attach_policy_statements          = true
  policy_statements = {
    AllowDownloadExcelObjects = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: uploads/{organization_id}/{agency_id}/{reporting_period_id}/{expenditure_category_code}/{upload_id}/{filename}.xlsm
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*/*.xlsm",
      ]
    }
    AllowUploadJsonObjects = {
      effect  = "Allow"
      actions = ["s3:PutObject"]
      resources = [
        # Path: uploads/{organization_id}/{agency_id}/{reporting_period_id}/{expenditure_category_code}/{upload_id}/{filename}.xlsm.json
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*/*.xlsm.json",
      ]
    }
  }

  // Artifacts
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-excelToJson.bucket
    key    = aws_s3_object.lambda_artifact-excelToJson.key
  }

  // Runtime
  handler       = var.datadog_enabled ? local.datadog_lambda_handler : "excelToJson.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_arch]
  publish       = true
  layers        = local.lambda_layer_arns
  timeout       = 300 # 5 minutes, in seconds
  memory_size   = 512 # MB
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER = "excelToJson.handler"
  })

  // Triggers
  allowed_triggers = {
    S3BucketNotification = {
      principal  = "s3.amazonaws.com"
      source_arn = module.reporting_data_bucket.bucket_arn
    }
  }
}

module "lambda_function-cpfValidation" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-cpfValidation"
  description   = "Reacts to S3 events and validates CPF JSON files."

  // Networking
  vpc_subnet_ids         = null
  vpc_security_group_ids = null
  attach_network_policy  = false

  // Permissions
  role_permissions_boundary         = local.permissions_boundary_arn
  attach_cloudwatch_logs_policy     = true
  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  attach_policy_jsons               = length(local.lambda_default_execution_policies) > 0
  number_of_policy_jsons            = length(local.lambda_default_execution_policies)
  policy_jsons                      = local.lambda_default_execution_policies
  attach_policy_statements          = true
  policy_statements = {
    AllowDownloadJSONObjects = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: uploads/{organization_id}/{agency_id}/{reporting_period_id}/{expenditure_category_code}/{upload_id}/{filename}.xlsm.json
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*/*.xlsm.json",
      ]
    }
  }

  // Artifacts
  publish        = true
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-cpfValidation.bucket
    key    = aws_s3_object.lambda_artifact-cpfValidation.key
  }

  // Runtime
  handler       = var.datadog_enabled ? local.datadog_lambda_handler : "cpfValidation.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_layer_arns
  timeout       = 60 # 1 minute, in seconds
  memory_size   = 512
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER = "cpfValidation.handler"
  })

  // Triggers
  allowed_triggers = {
    S3BucketNotification = {
      principal  = "s3.amazonaws.com"
      source_arn = module.reporting_data_bucket.bucket_arn
    }
  }
}
