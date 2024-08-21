module "treasury_generation_step_function" {
  source                    = "terraform-aws-modules/step-functions/aws"
  role_permissions_boundary = local.permissions_boundary_arn

  name = "${var.namespace}-generate-treasury-report"
  definition = jsonencode({
    "Comment" : "Generate all the files for a treasury report",
    "StartAt" : "Parallel",
    "States" : {
      "Parallel" : {
        "Type" : "Parallel",
        "Next" : "CreateTreasuryZipfile",
        "Branches" : [
          {
            "StartAt" : "Generate Project 1A File",
            "States" : {
              "Generate Project 1A File" : {
                "Type" : "Task",
                "Resource" : "arn:aws:states:::lambda:invoke",
                "OutputPath" : "$.Payload",
                "Parameters" : {
                  "Payload.$" : "$.1A",
                  "FunctionName" : module.lambda_function-treasuryProjectFileGeneration.lambda_function_arn
                },
                "Retry" : [
                  {
                    "ErrorEquals" : [
                      "Lambda.ServiceException",
                      "Lambda.AWSLambdaException",
                      "Lambda.SdkClientException",
                      "Lambda.TooManyRequestsException"
                    ],
                    "IntervalSeconds" : 1,
                    "MaxAttempts" : 2,
                    "BackoffRate" : 2
                  }
                ],
                "End" : true
              }
            }
          },
          {
            "StartAt" : "Generate Project 1B File",
            "States" : {
              "Generate Project 1B File" : {
                "Type" : "Task",
                "Resource" : "arn:aws:states:::lambda:invoke",
                "OutputPath" : "$.Payload",
                "Parameters" : {
                  "Payload.$" : "$.1B",
                  "FunctionName" : module.lambda_function-treasuryProjectFileGeneration.lambda_function_arn
                },
                "Retry" : [
                  {
                    "ErrorEquals" : [
                      "Lambda.ServiceException",
                      "Lambda.AWSLambdaException",
                      "Lambda.SdkClientException",
                      "Lambda.TooManyRequestsException"
                    ],
                    "IntervalSeconds" : 1,
                    "MaxAttempts" : 2,
                    "BackoffRate" : 2
                  }
                ],
                "End" : true
              }
            }
          },
          {
            "StartAt" : "Generate Project 1C File",
            "States" : {
              "Generate Project 1C File" : {
                "Type" : "Task",
                "Resource" : "arn:aws:states:::lambda:invoke",
                "OutputPath" : "$.Payload",
                "Parameters" : {
                  "Payload.$" : "$.1C",
                  "FunctionName" : module.lambda_function-treasuryProjectFileGeneration.lambda_function_arn
                },
                "Retry" : [
                  {
                    "ErrorEquals" : [
                      "Lambda.ServiceException",
                      "Lambda.AWSLambdaException",
                      "Lambda.SdkClientException",
                      "Lambda.TooManyRequestsException"
                    ],
                    "IntervalSeconds" : 1,
                    "MaxAttempts" : 2,
                    "BackoffRate" : 2
                  }
                ],
                "End" : true
              }
            }
          },
          {
            "StartAt" : "Generate Subrecipient File",
            "States" : {
              "Generate Subrecipient File" : {
                "Type" : "Task",
                "Resource" : "arn:aws:states:::lambda:invoke",
                "OutputPath" : "$.Payload",
                "Parameters" : {
                  "Payload.$" : "$.Subrecipient",
                  "FunctionName" : module.lambda_function-subrecipientTreasuryReportGen.lambda_function_arn
                },
                "Retry" : [
                  {
                    "ErrorEquals" : [
                      "Lambda.ServiceException",
                      "Lambda.AWSLambdaException",
                      "Lambda.SdkClientException",
                      "Lambda.TooManyRequestsException"
                    ],
                    "IntervalSeconds" : 1,
                    "MaxAttempts" : 2,
                    "BackoffRate" : 2
                  }
                ],
                "End" : true
              }
            }
          }
        ]
      },
      "CreateTreasuryZipfile" : {
        "Type" : "Task",
        "Resource" : "arn:aws:states:::lambda:invoke",
        "OutputPath" : "$.Payload",
        "Parameters" : {
          "FunctionName" : module.lambda_function-cpfCreateArchive.lambda_function_arn,
          "Payload.$" : "$.zip"
        },
        "Retry" : [
          {
            "ErrorEquals" : [
              "Lambda.ServiceException",
              "Lambda.AWSLambdaException",
              "Lambda.SdkClientException",
              "Lambda.TooManyRequestsException"
            ],
            "IntervalSeconds" : 1,
            "MaxAttempts" : 3,
            "BackoffRate" : 2
          }
        ],
        "End" : true
      }
    }
  })

  service_integrations = {
    lambda = {
      lambda = [module.lambda_function-treasuryProjectFileGeneration.lambda_function_arn, module.lambda_function-subrecipientTreasuryReportGen.lambda_function_arn, module.lambda_function-cpfCreateArchive.lambda_function_arn]
    }
  }

  type = "STANDARD"
}
