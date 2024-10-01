module "ecs_console_container_definition" {
  source  = "cloudposse/ecs-container-definition/aws"
  version = "0.61.1"

  container_name           = "console"
  container_image          = var.console_container_image
  essential                = true
  readonly_root_filesystem = "false"

  linux_parameters = {
    capabilities = {
      add  = []
      drop = []
    }
    devices            = []
    initProcessEnabled = true
    maxSwap            = null
    sharedMemorySize   = null
    swappiness         = null
    tmpfs              = []
  }

  map_environment = {
    AWS_REGION         = data.aws_region.current.name
    AWS_DEFAULT_REGION = data.aws_region.current.name
    CI                 = ""
    NODE_ENV           = "development"
  }

  map_secrets = {
    DATABASE_URL = aws_ssm_parameter.ecs_console_secret_database_url.arn
  }

  log_configuration = {
    logDriver = "awslogs"
    options = {
      awslogs-group         = aws_cloudwatch_log_group.ecs.name
      awslogs-region        = data.aws_region.current.name
      awslogs-stream-prefix = "console"
    }
  }
}

resource "aws_ssm_parameter" "ecs_console_secret_database_url" {
  name        = "${var.ssm_service_parameters_path_prefix}/postgres/database_url"
  description = "Prisma database URL for connecting the Postgres cluster"
  type        = "SecureString"
  key_id      = data.aws_kms_key.ssm.arn
  value = format(
    "postgres://%s:%s@%s:%s/%s?%s",
    module.postgres.cluster_master_username,
    module.postgres.cluster_master_password,
    module.postgres.cluster_endpoint,
    module.postgres.cluster_port,
    module.postgres.cluster_database_name,
    join("&", [
      "sslmode=require",
      "sslcert=${urlencode("/home/node/app/api/db/rds-global-bundle.pem")}",
    ])
  )
}

resource "aws_iam_role" "ecs_console_execution" {
  name_prefix          = "${var.namespace}-console-ECSTaskExecution-"
  permissions_boundary = local.permissions_boundary_arn
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

data "aws_iam_policy_document" "ecs_console_execution" {
  statement {
    sid    = "DecryptSSMSecrets"
    effect = "Allow"
    actions = [
      "kms:Decrypt",
      "ssm:GetParameters",
    ]
    resources = [
      data.aws_kms_key.ssm.arn,
      aws_ssm_parameter.ecs_console_secret_database_url.arn,
    ]
  }
  statement {
    sid    = "WriteLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
    ]
    resources = [
      aws_cloudwatch_log_group.ecs.arn,
      "${aws_cloudwatch_log_group.ecs.arn}:log-stream:*",
    ]
  }
}

resource "aws_iam_role_policy" "ecs_console_execution" {
  role   = aws_iam_role.ecs_console_execution.name
  policy = data.aws_iam_policy_document.ecs_console_execution.json
}

resource "aws_iam_role" "ecs_console_task" {
  name_prefix          = "${var.namespace}-ECSConsoleTask-"
  permissions_boundary = local.permissions_boundary_arn
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:ecs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*",
          },
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
    ]
  })
}

data "aws_iam_policy_document" "ecs_console_task" {
  statement {
    sid       = "PostgresIAMAuth"
    effect    = "Allow"
    actions   = ["rds-db:connect"]
    resources = ["${local.postgres_rds_connect_resource_base_arn}/${module.postgres.cluster_master_username}"]
  }
  statement {
    sid    = "AllowECSExec"
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    resources = ["*"]
  }
  statement {
    sid       = "InventoryLogGroupsForExec"
    effect    = "Allow"
    actions   = ["logs:DescribeLogGroups"]
    resources = ["*"]
  }
  statement {
    sid    = "WriteExecLogs"
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.ecs.arn}:log-stream:*"]
  }
  // add permissions to delete objects from s3 bucket
  statement {
    sid    = "DeleteS3Objects"
    effect = "Allow"
    actions = [
      "s3:DeleteObject",
      "s3:DeleteObjectVersion",
    ]
    resources = [
      "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*.xlsm",
      "${module.reporting_data_bucket.bucket_arn}/uploads/*/*/*/*/*.xlsm.json",
    ]
  }
}

resource "aws_iam_role_policy" "ecs_console_task" {
  role   = aws_iam_role.ecs_console_task.name
  policy = data.aws_iam_policy_document.ecs_console_task.json
}

resource "aws_ecs_task_definition" "console" {
  family                   = "${var.namespace}-console"
  execution_role_arn       = aws_iam_role.ecs_console_execution.arn
  task_role_arn            = aws_iam_role.ecs_console_task.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions    = jsonencode([module.ecs_console_container_definition.json_map_object])
  tags                     = {}

  cpu    = 512
  memory = 1024

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  lifecycle {
    create_before_destroy = true
  }
}

module "ecs_console_security_group" {
  source  = "cloudposse/security-group/aws"
  version = "2.2.0"
  context = module.this.context

  vpc_id           = data.aws_ssm_parameter.vpc_id.value
  attributes       = ["ecs", "console"]
  allow_all_egress = true

  create_before_destroy = true
}

resource "aws_ecs_service" "console" {
  name                   = "${var.namespace}-console"
  cluster                = aws_ecs_cluster.default.id
  task_definition        = aws_ecs_task_definition.console.arn
  desired_count          = 1
  launch_type            = "FARGATE"
  enable_execute_command = true
  propagate_tags         = "SERVICE"

  network_configuration {
    assign_public_ip = false
    subnets          = local.private_subnet_ids
    security_groups = [
      module.ecs_console_security_group.id,
      module.postgres.security_group_id,
    ]
  }

  depends_on = [
    aws_iam_role.ecs_console_execution,
    aws_iam_role.ecs_console_task
  ]
}
