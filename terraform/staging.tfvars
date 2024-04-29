// Common
namespace                             = "cpfreporter"
environment                           = "staging"
ssm_service_parameters_path_prefix    = "/cpfreporter"
ssm_deployment_parameters_path_prefix = "/cpfreporter/deploy-config"
log_bucket_versioning                 = false
log_retention_in_days                 = 14

// Datadog
datadog_enabled                       = true
datadog_draft                         = true
datadog_dashboards_enabled            = true
datadog_monitors_enabled              = true
datadog_monitor_notification_handles  = []
datadog_lambda_extension_version      = "55"
datadog_lambda_js_tracer_version      = "108"
datadog_lambda_py_tracer_version      = "91"
datadog_default_environment_variables = { DD_CAPTURE_LAMBDA_PAYLOAD = "true" }
// Only defined in staging:
datadog_metrics_metadata = {}

// RDS Postgres
postgres_prevent_destroy           = true
postgres_snapshot_before_destroy   = true
postgres_apply_changes_immediately = true
postgres_query_logging_enabled     = true

// General Lambda options
lambda_log_level  = "debug"
lambda_js_runtime = "nodejs18.x"
lambda_py_runtime = "python3.12"
lambda_arch       = "x86_64"

// Website
website_domain_name   = "staging.cpf.usdr.dev"
website_feature_flags = {}
website_config_params = {
  passage_app_id = "TBD"
  auth_provider  = "local"
}

// API Auth Provider
auth_provider = "local"

// API
api_domain_name = "api.staging.cpf.usdr.dev"
