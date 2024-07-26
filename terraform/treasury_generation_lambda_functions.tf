
module "lambda_function-subrecipientTreasuryReportGen" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-subrecipientTreasuryReportGen"
  description   = "Generates subrecipients file for treasury report when called by step function."

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
    AllowDownloadSubrecipientsFile = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: /{organization_id}/{reporting_period_id}/subrecipients
        "${module.reporting_data_bucket.bucket_arn}/*/*/subrecipients",
      ]
    }
    AllowUploadCSVReport = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/{userId}/CPFSubrecipientTemplate.csv
        "${module.reporting_data_bucket.bucket_arn}/treasuryReports/*/*/*/CPFSubrecipientTemplate.csv",
      ]
    }
  }

  // Artifacts
  publish        = true
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-python.bucket
    key    = aws_s3_object.lambda_artifact-python.key
  }

  // Runtime
  handler       = var.datadog_enabled ? local.datadog_lambda_py_handler : "src.functions.subrecipient_treasury_report_gen.handle"
  runtime       = var.lambda_py_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_py_layer_arns
  timeout       = 60 # 1 minute, in seconds
  memory_size   = 512
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER = "src.functions.subrecipient_treasury_report_gen.handle"
    DD_LOGS_INJECTION = "true"
  })

  allowed_triggers = {
    StepFunctionTrigger = {
      principal  = "states.amazonaws.com"
      source_arn = module.treasury_generation_step_function.state_machine_arn
    }

  }
}

module "lambda_function-treasuryReportGeneration" {
  for_each = toset(["1A", "1B", "1C"])
  source   = "terraform-aws-modules/lambda/aws"
  version  = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-treasuryReportGeneration${each.key}"
  description   = "Creates the Treasury Report for Projects ${each.key}."

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
    AllowDownloadExcelObjects = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: treasuryreports/{organization_id}/{reporting_period_id}/{filename}.xlsm
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.xlsm",
      ]
    }
    AllowUploadXlsxObjects = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # Path: uploads/{organization_id}/{reporting_period_id}/{filename}.xlsx
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*.xlsx",
      ]
    }
    AllowUploadCsvObjects = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # Path: uploads/{organization_id}/{reporting_period_id}/{filename}.csv
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*.csv",
      ]
    }
    AllowUploadJsonObjects = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # Path: uploads/{organization_id}/{reporting_period_id}/{filename}.json
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*.json",
      ]
    }
  }

  // Artifacts
  publish        = true
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_object.lambda_artifact-python.bucket
    key    = aws_s3_object.lambda_artifact-python.key
  }

  // Runtime
  handler       = var.datadog_enabled ? local.datadog_lambda_py_handler : "src.functions.generate_treasury_report.handle"
  runtime       = var.lambda_py_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_py_layer_arns
  timeout       = 60 # 1 minute, in seconds
  memory_size   = 512
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER = "src.functions.generate_treasury_report.handle"
    DD_LOGS_INJECTION = "true"
    PROJECT_USE_CODE  = "${each.key}"
  })

  // Triggers
  allowed_triggers = {
    S3BucketNotification = {
      principal  = "s3.amazonaws.com"
      source_arn = module.reporting_data_bucket.bucket_arn
    }
    StepFunctionTrigger = {
      principal  = "states.amazonaws.com"
      source_arn = module.treasury_generation_step_function.state_machine_arn
    }
  }
}
