data "aws_rds_engine_version" "postgres15_4" {
  engine  = "aurora-postgresql"
  version = "15.4"
}

resource "aws_db_parameter_group" "postgres15" {
  name        = "${var.namespace}-aurora-postgres15-db"
  family      = "aurora-postgresql15"
  description = "RDS Aurora database instance parameter group for ${var.namespace} cluster members."
}

resource "aws_rds_cluster_parameter_group" "postgres15" {
  name        = "${var.namespace}-aurora-postgres15-cluster"
  family      = "aurora-postgresql15"
  description = "RDS Aurora cluster parameter group for ${var.namespace}."

  parameter {
    name  = "log_statement"
    value = var.postgres_query_logging_enabled ? "all" : "none"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = var.postgres_query_logging_enabled ? "1" : "-1"
  }
}

resource "random_password" "postgres_user" {
  length  = 32
  special = false
}

module "postgres" {
  create  = true
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "8.5.0"

  name                       = "${var.namespace}-postgres"
  cluster_use_name_prefix    = true
  engine                     = data.aws_rds_engine_version.postgres15_4.engine
  engine_version             = data.aws_rds_engine_version.postgres15_4.version
  auto_minor_version_upgrade = true
  engine_mode                = "provisioned"
  storage_encrypted          = true

  vpc_id                         = data.aws_ssm_parameter.vpc_id
  subnets                        = local.private_subnet_ids
  create_security_group          = true
  create_db_subnet_group         = true
  security_group_use_name_prefix = true

  db_parameter_group_name         = aws_db_parameter_group.postgres15.id
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.postgres15.id

  database_name                       = "cpf_reporter"
  master_username                     = "postgres"
  master_password                     = random_password.postgres_user.result
  manage_master_user_password         = false
  iam_database_authentication_enabled = true

  monitoring_interval           = 60 // seconds
  iam_role_name                 = "${var.namespace}-db-monitoring-"
  iam_role_use_name_prefix      = true
  iam_role_permissions_boundary = local.permissions_boundary_arn

  apply_immediately     = var.postgres_apply_changes_immediately
  skip_final_snapshot   = var.postgres_snapshot_before_destroy
  deletion_protection   = var.postgres_prevent_destroy
  copy_tags_to_snapshot = true

  serverlessv2_scaling_configuration = {
    min_capacity = 0.5
    max_capacity = 1.5
  }

  instance_class = "db.serverless"
  instances = {
    one = {}
  }
}

locals {
  // Usage as IAM policy statement resource:
  // "${local.postgres_rds_connect_resource_base_arn}/my-postgres-username"
  postgres_rds_connect_resource_base_arn = join(":", [
    "arn",
    data.aws_partition.current.id,
    "rds-db",
    data.aws_region.current.id,
    data.aws_caller_identity.current.account_id,
    "dbuser",
    module.postgres.cluster_resource_id,
  ])
}
