
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
    AllowListSubrecipientData = {
      effect = "Allow"
      actions = [
        "s3:ListBucket"
      ]
      resources = [
        "${module.reporting_data_bucket.bucket_arn}",
      ]
      # Path: /{organization_id}/{reporting_period_id}/*
      condition = {
        string_like_condition = {
          test     = "StringLike"
          variable = "s3:prefix"
          values   = ["*/*/*"]
        }
      }
    }
    AllowDownloadSubrecipientsFile = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are temporary files shared across services containing subrecipient data.
        # Path: treasuryreports/{organization_id}/{reporting_period_id}/subrecipients.json
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/subrecipients.json",
      ]
    }
    AllowDownloadTreasuryOutputTemplates = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are empty output templates that can then be used to fill data.
        # Path: treasuryreports/output-templates/{output_template_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/output-templates/*/*.xlsx",
      ]
    }
    AllowUploadCSVReport = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # These are completed CSV version of the subrecipient file that can be submitted to treasury.
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/CPFSubrecipientTemplate.csv
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.csv",
      ]
    }
    AllowUploadXLSXReport = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # These are completed XLSX version of the subrecipient file that can be submitted to treasury.
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/CPFSubrecipientTemplate.xlsx
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.xlsx",
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

module "lambda_function-treasuryProjectFileGeneration" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-treasuryProjectFileGeneration"
  description   = "Creates the Treasury Report for Projects."

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
    AllowDownloadXLSMUploads = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are workbooks uploaded by partners that contain the information which eventually end up in a treasury report.
        # Path: uploads/{organization_id}/{agency_id}/{reporting_period_id}/{upload_id}/{filename}.xlsm
        "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*.xlsm",
      ]
    }
    AllowDownloadJsonMetadata = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are metadata about previously generated project (1A, 1B, or 1C) output files.
        # Path: treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project_use_code]}.json
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.json",
      ]
    }
    AllowUploadJsonMetadata = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # These are metadata about previously generated project (1A, 1B, or 1C) output files.
        # Path: treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project_use_code]}.json
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.json",
      ]
    }
    AllowDownloadTreasuryOutputTemplates = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are empty output templates that can then be used to fill data.
        # Path: treasuryreports/output-templates/{output_template_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/output-templates/*/*.xlsx",
      ]
    }
    AllowListReportObjects = {
      effect = "Allow"
      actions = [
        "s3:ListBucket"
      ]
      resources = [
        "${module.reporting_data_bucket.bucket_arn}",
      ]
      # Path: treasuryreports/{organization_id}/{reporting_period_id}/*
      condition = {
        string_like_condition = {
          test     = "StringLike"
          variable = "s3:prefix"
          values   = ["treasuryreports/*/*/*"]
        }
      }
    }
    AllowUploadCSVReport = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # These are completed CSV version of the project (1A, 1B, or 1C) file that can be submitted to treasury.
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.csv
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.csv",
      ]
    }
    AllowUploadXLSXReport = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # These are completed XLSX version of the project (1A, 1B, or 1C) file that can be submitted to treasury.
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.xlsx",
      ]
    }
    AllowDownloadXLSXReport = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # These are completed XLSX version of the project (1A, 1B, or 1C) file that can be submitted to treasury.
        # Path: /treasuryreports/{organization_id}/{reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.xlsx",
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

module "lambda_function-cpfCreateArchive" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-cpfCreateArchive"
  description   = "Invoked by step function and generates archive files of CSV's."

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
    AllowListReportObjects = {
      effect = "Allow"
      actions = [
        "s3:ListBucket"
      ]
      resources = [
        "${module.reporting_data_bucket.bucket_arn}",
      ]
      # Path: treasuryreports/{organization_id}/{reporting_period_id}/*
      condition = {
        string_like_condition = {
          test     = "StringLike"
          variable = "s3:prefix"
          values   = ["treasuryreports/*/*/*"]
        }
      }
    }
    AllowDownloadExcelObjects = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: treasuryreports/{organization_id}/{reporting_period_id}/{filename}.csv
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.csv",
      ]
    }
    AllowUploadZipArchive = {
      effect = "Allow"
      actions = [
        "s3:PutObject"
      ]
      resources = [
        # Path: treasuryreports/{organization_id}/{reporting_period_id}/{filename}.zip
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.zip",
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
  handler       = var.datadog_enabled ? local.datadog_lambda_py_handler : "src.functions.create_archive.handle"
  runtime       = var.lambda_py_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_py_layer_arns
  timeout       = 60 # 1 minute, in seconds
  memory_size   = 512
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER = "src.functions.create_archive.handle"
    DD_LOGS_INJECTION = "true"
  })

  // Triggers
  allowed_triggers = {
    StepFunctionTrigger = {
      principal  = "states.amazonaws.com"
      source_arn = module.treasury_generation_step_function.state_machine_arn
    }
  }
}
data "aws_ses_domain_identity" "notifications" {
  domain = split("@", var.notifications_email_address)[1]
}

module "lambda_function-email-presigned-url" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "6.5.0"

  // Metadata
  function_name = "${var.namespace}-email-presigned-url"
  description   = "Send email with presigned URL for treasury report."

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
    AllowGetZipFile = {
      effect = "Allow"
      actions = [
        "s3:GetObject",
        "s3:HeadObject",
      ]
      resources = [
        # Path: treasuryreports/{organization_id}/{reporting_period_id}/{filename}.zip
        "${module.reporting_data_bucket.bucket_arn}/treasuryreports/*/*/*.zip",
      ]
    }
    AllowSendEmails = {
      effect = "Allow"
      actions = [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ]
      resources = [
        data.aws_ses_domain_identity.notifications.arn,
      ]
      conditions = [
        {
          test     = "StringLike"
          variable = "ses:FromAddress"
          values   = [var.notifications_email_address]
        }
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
  handler       = var.datadog_enabled ? local.datadog_lambda_py_handler : "src.functions.generate_presigned_url_and_send_email"
  runtime       = var.lambda_py_runtime
  architectures = [var.lambda_arch]
  layers        = local.lambda_py_layer_arns
  timeout       = 60 # 1 minute, in seconds
  memory_size   = 512
  environment_variables = merge(local.lambda_default_environment_variables, {
    DD_LAMBDA_HANDLER   = "src.functions.generate_presigned_url_and_send_email"
    DD_LOGS_INJECTION   = "true"
    NOTIFICATIONS_EMAIL = var.notifications_email_address
  })

  // Triggers
  allowed_triggers = {
    StepFunctionTrigger = {
      principal  = "states.amazonaws.com"
      source_arn = module.treasury_generation_step_function.state_machine_arn
    }
  }
}
