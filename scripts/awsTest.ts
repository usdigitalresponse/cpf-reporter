import { startStepFunctionExecution } from 'api/src/lib/aws'

export default async ({ args }) => {
  /*
    Example running:
      yarn redwood exec awsTest --input '{"var1":"val1"}' --arn arn:aws:states:us-west-2:000000000000:stateMachine:run-sample-functions --name "testing"

    Using the executionArn from above in the next command.
    The arn should looks something like
        arn:aws:states:us-west-2:000000000000:execution:run-sample-functions:8110adbe-6807-443f-82ba-6acf9bc527ea

    To check the output, do the following:
        docker exec -it cpf-reporter-localstack-main /bin/bash
        awslocal stepfunctions describe-execution --execution-arn [executionArn from above]
   */

  console.log(':: Executing script with args ::')
  console.log(`Received following arguments: ${Object.keys(args)}`)

  const { arn, name, input } = args
  const result = await startStepFunctionExecution(arn, name, input, '')
  console.log(result)
  console.log(result.body)
}
