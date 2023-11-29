locals {
  api_domain_name = coalesce(var.api_domain_name, "api.${var.website_domain_name}")
}

module "api_ssl_certificate" {
  source  = "cloudposse/acm-request-certificate/aws"
  version = "0.17.0"

  domain_name                       = local.api_domain_name
  zone_id                           = data.aws_ssm_parameter.public_dns_zone_id.value
  process_domain_validation_options = true
  wait_for_certificate_issued       = true
}

resource "aws_cloudwatch_log_group" "api_gateway" {
  name_prefix       = "${var.namespace}-apigateway-"
  retention_in_days = var.log_retention_in_days
}

module "write_api_logs_policy" {
  source  = "cloudposse/iam-policy/aws"
  version = "2.0.1"
  context = module.this.context

  name = "write-logs"

  iam_policy_statements = {
    WriteLogs = {
      effect = "Allow"
      actions = [
        "logs:CreateLogStream",
        "logs:DescribeLogStreams",
        "logs:PutLogEvents",
      ]
      resources = [
        aws_cloudwatch_log_group.api_gateway.arn,
        "${aws_cloudwatch_log_group.api_gateway.arn}:log-stream:*",
      ]
    }
  }
}

module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = var.namespace
  description   = "API Gateway proxy to ECS web services for GOST"
  protocol_type = "HTTP"

  domain_name                 = local.api_domain_name
  domain_name_certificate_arn = module.api_ssl_certificate.arn

  cors_configuration = {
    allow_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    allow_origins = sort([
      "https://${local.api_domain_name}",
      "http://${var.website_domain_name}",
    ])
    allow_credentials = true
    allow_headers = [
      "authorization",
      "content-type",
      "x-amz-date",
      "x-amz-security-token",
      "x-amz-user-agent",
      "x-api-key",
    ]
    max_age = 86400 // 24 hours, in seconds
  }

  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.api_gateway.arn
  default_stage_access_log_format = jsonencode({
    requestId      = "$context.requestId"
    ip             = "$context.identity.sourceIp"
    requestTime    = "$context.requestTime"
    httpMethod     = "$context.httpMethod"
    routeKey       = "$context.routeKey"
    status         = "$context.status"
    protocol       = "$context.protocol"
    responseLength = "$context.responseLength"
    path           = "$context.path"
    integration = {
      error         = "$context.integration.error"
      serviceStatus = "$context.integration.integrationStatus"
      latency       = "$context.integration.latency"
      requestId     = "$context.integration.requestId"
      status        = "$context.integration.status"
      errorMessage  = "$context.integrationErrorMessage"
      latency       = "$context.integrationLatency"
    }
  })

  integrations = {
    "POST /graphql" = {
      lambda_arn      = module.lambda_function-graphql.lambda_function_arn
      connection_type = "VPC_LINK"
      vpc_link        = "api-service"
    }
    "GET /graphql" = {
      lambda_arn      = module.lambda_function-graphql.lambda_function_arn
      connection_type = "VPC_LINK"
      vpc_link        = "api-service"
    }
  }
}

resource "aws_route53_record" "apigateway_alias" {
  zone_id = data.aws_ssm_parameter.public_dns_zone_id.value
  name    = local.api_domain_name
  type    = "A"

  alias {
    name                   = module.api_gateway.apigatewayv2_domain_name_target_domain_name
    zone_id                = module.api_gateway.apigatewayv2_domain_name_hosted_zone_id
    evaluate_target_health = false
  }
}
