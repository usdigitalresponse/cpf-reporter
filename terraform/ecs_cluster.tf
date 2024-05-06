resource "aws_ecs_cluster" "default" {
  name  = var.namespace
  count = var.is_localstack ? 0 : 1
  setting {
    name  = "containerInsights"
    value = var.ecs_cluster_container_insights_enabled ? "enabled" : "disabled"
  }

  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "default" {
  count              = var.is_localstack ? 0 : 1
  cluster_name       = aws_ecs_cluster.default[0].name
  capacity_providers = ["FARGATE"]
}

resource "aws_cloudwatch_log_group" "ecs" {
  name_prefix       = "${var.namespace}-ecs-"
  retention_in_days = var.log_retention_in_days
}
