variable "namespace" {
  type        = string
  description = "Prefix to use for resource names and identifiers."
}

variable "environment" {
  type        = string
  description = "Name of the environment/stage targeted by deployments (e.g. sandbox/staging/prod)."
}

variable "version_identifier" {
  type        = string
  description = "The version for this service deployment."
}

variable "git_repository_url" {
  type        = string
  description = "URL for the repository that provides this service."
  default     = "github.com/usdigitalresponse/cpf-reporter"
}

variable "git_commit_sha" {
  type        = string
  description = "Git commit SHA for which terraform is being deployed."
  default     = ""
}

variable "permissions_boundary_policy_name" {
  description = "Name of the permissions boundary for service roles"
  type        = string
  default     = "service-management-boundary"
}

variable "ssm_service_parameters_path_prefix" {
  type        = string
  description = "Base path for all service-managed SSM parameters."
  validation {
    condition     = startswith(var.ssm_service_parameters_path_prefix, "/")
    error_message = "Value must start with a forward slash."
  }
  validation {
    condition     = !endswith(var.ssm_service_parameters_path_prefix, "/")
    error_message = "Value cannot end with a trailing slash."
  }
}

variable "ssm_deployment_parameters_path_prefix" {
  type        = string
  description = "Base path for all SSM parameters used for deployment."
  validation {
    condition     = startswith(var.ssm_deployment_parameters_path_prefix, "/")
    error_message = "Value must start with a forward slash."
  }
  validation {
    condition     = !endswith(var.ssm_deployment_parameters_path_prefix, "/")
    error_message = "Value cannot end with a trailing slash."
  }
}

variable "log_bucket_versioning" {
  description = "Whether to enable object versioning for log bucket. Should always be enabled in Production."
  type        = bool
  default     = true
}

// DNS
variable "website_domain_name" {
  description = "The domain name for hosting the client website."
  type        = string
}

variable "api_domain_name" {
  description = "Overrides the API domain. Defaults to `api.<website_domain_name>`."
  type        = string
  default     = ""
}

// Common logging configuration
variable "log_retention_in_days" {
  description = "Number of days to retain CloudWatch logs."
  type        = number
  default     = 30
}

// Datadog
variable "datadog_enabled" {
  description = "Whether to enable datadog instrumentation in the current environment."
  type        = bool
  default     = false
}

variable "datadog_dashboards_enabled" {
  description = "Whether to provision Datadog dashboards."
  type        = bool
  default     = true
}

variable "datadog_monitors_enabled" {
  description = "Whether to provision Datadog monitors."
  type        = bool
  default     = false
}

variable "datadog_monitor_notification_handles" {
  description = "List of handles to notify on monitor alerts."
  type        = list(string)
  default     = []
}

variable "datadog_api_key" {
  description = "API key to use when provisioning Datadog resources."
  type        = string
  default     = ""
  sensitive   = true
}

variable "datadog_app_key" {
  description = "Application key to use when provisioning Datadog resources."
  type        = string
  default     = ""
  sensitive   = true
}

variable "datadog_draft" {
  description = "Marks Datadog resources as drafts. Set to false when deploying to Production."
  type        = bool
  default     = true
}

variable "datadog_reserved_tags" {
  description = "Datadog reserved tags to configure in Lambda function environments (when var.datadog_enabled is true)."
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for k in keys(var.datadog_reserved_tags) :
      contains(["DD_ENV", "DD_SERVICE", "DD_VERSION"], k)
    ])
    error_message = "Datadog reserved tags may only include keys DD_ENV, DD_SERVICE, or DD_VERSION."
  }
}

variable "datadog_default_environment_variables" {
  description = "Datadog environment variables to configure in Lambda function environments (when var.datadog_enabled is true)."
  type        = map(string)
  default     = {}

  validation {
    condition = alltrue([
      for k in keys(var.datadog_default_environment_variables) :
      startswith(k, "DD_")
    ])
    error_message = "Datadog environment variable `DD_` prefix is required."
  }

  validation {
    condition = !anytrue([
      for k in keys(var.datadog_default_environment_variables) :
      contains(["DD_ENV", "DD_SERVICE", "DD_VERSION"], k)
    ])
    error_message = "Use var.datadog_reserved_tags to configure unified service tags."
  }
}

variable "datadog_metrics_metadata" {
  description = "Map of metadata describing custom Datadog metrics, keyed by the metric name. All metrics are automatically prefixed with cpf_reporter."
  type = map(object({
    short_name  = optional(string)
    description = optional(string)
    type        = optional(string) # https://docs.datadoghq.com/metrics/types/ (default: "gauge")
    unit        = optional(string) # https://docs.datadoghq.com/metrics/units/
    per_unit    = optional(string)
  }))
  default = {}
}

variable "datadog_lambda_tracer_version" {
  description = "Version to use for the Datadog Lambda Tracer layer (when var.datadog_enabled is true)."
  type        = string
  default     = "101"
}

variable "datadog_lambda_extension_version" {
  description = "Version to use for the Datadog Lambda Extension layer (when var.datadog_enabled is true)."
  type        = string
  default     = "51"
}

// RDS Postgres options
variable "postgres_query_logging_enabled" {
  description = "Enable query logging for Postgres cluster."
  type        = bool
  default     = false
}

variable "postgres_prevent_destroy" {
  description = "Whether to enable deletion protection for the DB. The cluster cannot be destroyed when this value is true."
  type        = bool
  default     = true
}

variable "postgres_apply_changes_immediately" {
  description = "Whether to apply cluster changes ahead of the next maintenance window (which may cause downtime). Set to true only when changes are urgent."
  type        = bool
  default     = false
}

variable "postgres_snapshot_before_destroy" {
  description = "Whether to create a final database snapshot before destroying the cluster."
  type        = bool
  default     = true
}

// ECS
variable "ecs_cluster_container_insights_enabled" {
  description = "Whether to enable ECS container insights."
  type        = bool
  default     = false
}

variable "console_container_image" {
  description = "Complete Docker image tag to pull for RedwoodJS console ECS tasks."
  type        = string
}

// Lambda
variable "lambda_runtime" {
  description = "Lambda runtime for the target Node.js version."
  type        = string
  default     = "nodejs18.x"
}

variable "lambda_arch" {
  description = "The target build architecture for Lambda functions (either x86_64 or arm64)."
  type        = string
  default     = "x86_64"

  validation {
    condition     = var.lambda_arch == "x86_64" || var.lambda_arch == "arm64"
    error_message = "Architecture must be x86_64 or arm64."
  }
}

variable "lambda_artifacts_base_path" {
  description = "Path to the directory where per-Lambda zip file artifacts are stored."
  type        = string
  default     = ""
}

variable "lambda_log_level" {
  description = "Sets the $LOG_LEVEL environment variable for Lambda functions."
  type        = string
  default     = "info"
}

// Web (static client site served from CDN)
variable "website_origin_artifacts_dist_path" {
  description = "Path to the local directory from which website build artifacts are sourced and uploaded to the S3 origin bucket."
  type        = string
  default     = ""
}

variable "website_feature_flags" {
  description = "Feature flags for configuring the website independently of builds."
  type        = any
  default     = {}
  validation {
    condition     = can(lookup(var.website_feature_flags, uuid(), "default"))
    error_message = "Value must be an object."
  }
  validation {
    condition     = can(jsonencode(var.website_feature_flags))
    error_message = "Value must be JSON-serializable."
  }
}

variable "website_config_params" {
  description = "Configurations for the  website that are not feature-specific."
  type = any
  default = {}
    validation {
    condition     = can(lookup(var.website_config_params, uuid(), "default"))
    error_message = "Value must be an object."
  }
    validation {
    condition     = can(jsonencode(var.website_config_params))
    error_message = "Value must be JSON-serializable."
  }
}
