// Common
namespace                             = "cpfreporter"
environment                           = "staging"
ssm_service_parameters_path_prefix    = "/cpfreporter"
ssm_deployment_parameters_path_prefix = "/cpfreporter/deploy-config"
log_bucket_versioning                 = false
log_retention_in_days                 = 14

// Datadog
datadog_enabled                      = true
datadog_draft                        = true
datadog_dashboards_enabled           = true
datadog_monitors_enabled             = true
datadog_monitor_notification_handles = []
datadog_lambda_extension_version     = "51"
datadog_lambda_tracer_version        = "101"
// Only defined in staging:
datadog_metrics_metadata = {}

// RDS Postgres
postgres_prevent_destroy           = true
postgres_snapshot_before_destroy   = true
postgres_apply_changes_immediately = true
postgres_query_logging_enabled     = true

// General Lambda options
lambda_log_level = "debug"
lambda_runtime   = "nodejs18.x"
lambda_arch      = "x86_64"

// Website
website_domain_name   = "staging.cpf.usdr.dev"
website_feature_flags = {}

// API
api_domain_name = "api.staging.cpf.usdr.dev"
