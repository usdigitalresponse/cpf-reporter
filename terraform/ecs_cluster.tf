resource "aws_ecs_cluster" "default" {
  name = var.namespace

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
  cluster_name       = aws_ecs_cluster.default.name
  capacity_providers = ["FARGATE"]
}

resource "aws_cloudwatch_log_group" "ecs" {
  name_prefix       = "${var.namespace}-ecs-"
  retention_in_days = var.log_retention_in_days
}
