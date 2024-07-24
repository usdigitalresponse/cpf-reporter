import {
  DeleteObjectCommandInput,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  SFNClient,
  StartExecutionCommand,
  StartExecutionCommandOutput,
} from '@aws-sdk/client-sfn'
import {
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import { StreamingBlobPayloadInputTypes } from '@smithy/types'
import { CreateUploadInput, Upload } from 'types/graphql'

const REPORTING_DATA_BUCKET_NAME = `${process.env.REPORTING_DATA_BUCKET_NAME}`

function getS3Client() {
  let s3: S3Client
  if (process.env.LOCALSTACK_HOSTNAME) {
    /*
        1. Make sure the local environment has awslocal installed.
        2. Use the commands to create a bucket to test with.
            - awslocal s3api create-bucket --bucket cpf-reporter --region us-west-2 --create-bucket-configuration '{"LocationConstraint": "us-west-2"}'
        3. Access bucket resource metadata through the following URL.
            - awslocal s3api list-buckets
            - awslocal s3api list-objects --bucket cpf-reporter
        4. Configure cors to allow uploads via signed URLs

        ===== cors-config.json =====
        {
          "CORSRules": [
            {
              "AllowedHeaders": ["*"],
              "AllowedMethods": ["GET", "POST", "PUT"],
              "AllowedOrigins": ["http://localhost:8910"],
              "ExposeHeaders": ["ETag"]
            }
          ]
        }

            - awslocal s3api put-bucket-cors --bucket cpf-reporter --cors-configuration file://cors-config.json
    */
    console.log('------------ USING LOCALSTACK ------------')
    const endpoint = `http://${process.env.LOCALSTACK_HOSTNAME}:${
      process.env.EDGE_PORT || 4566
    }`
    console.log(`endpoint: ${endpoint}`)
    s3 = new S3Client({
      endpoint,
      forcePathStyle: true,
      region: process.env.AWS_DEFAULT_REGION,
    })
  } else {
    s3 = new S3Client()
  }
  return s3
}

async function sendPutObjectToS3Bucket(
  bucketName: string,
  key: string,
  body: StreamingBlobPayloadInputTypes
): Promise<void> {
  const s3 = getS3Client()
  const uploadParams: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ServerSideEncryption: 'AES256',
  }
  await s3.send(new PutObjectCommand(uploadParams))
}

export function getTemplateRules(inputTemplateId: number) {
  return sendHeadObjectToS3Bucket(
    REPORTING_DATA_BUCKET_NAME,
    `templates/input_templates/${inputTemplateId}/rules/`
  )
}

async function sendHeadObjectToS3Bucket(bucketName: string, key: string) {
  const s3 = getS3Client()
  const uploadParams: HeadObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  }
  await s3.send(new HeadObjectCommand(uploadParams))
}

/**
 * Create an upload key used for S3 based on the upload or create upload input object.
 * If the upload is new, such as a CreateUploadInput object, the id will be null as it is not from the database.
 * In that case, you can use the optional uploadId field to create the key.
 */
export function getS3UploadFileKey(organizationId: number, upload: Upload | CreateUploadInput, uploadId?: number) {
  if ('id' in upload) {
    uploadId = upload.id
  }
  return `uploads/${organizationId}/${upload.agencyId}/${upload.reportingPeriodId}/${uploadId}/${upload.filename}`
}

export async function s3PutSignedUrl(
  upload: CreateUploadInput,
  uploadId: number,
  organizationId: number
): Promise<string> {
  const s3 = getS3Client()
  const key = getS3UploadFileKey(organizationId, upload, uploadId)
  const baseParams: PutObjectCommandInput = {
    Bucket: REPORTING_DATA_BUCKET_NAME,
    Key: key,
    ContentType: 'application/vnd.ms-excel.sheet.macroenabled.12',
    ServerSideEncryption: 'AES256',
  }
  const url = await awsGetSignedUrl(s3, new PutObjectCommand(baseParams), {
    expiresIn: 60,
  })
  return url
}

export async function deleteUploadFile(upload: Upload) {
  const fileKey = getS3UploadFileKey(upload.agency.organizationId, upload)
  await s3DeleteObject(fileKey)
}

async function s3DeleteObject(key: string) {
  const s3 = getS3Client()
  const baseParams: DeleteObjectCommandInput = {
    Bucket: REPORTING_DATA_BUCKET_NAME,
    Key: key,
  }
  await s3.send(new DeleteObjectCommand(baseParams))
}

/**
 *  This function is a wrapper around the getSignedUrl function from the @aws-sdk/s3-request-presigner package.
 *  Exists to organize the imports and to make it easier to mock in tests.
 */
async function getSignedUrl(upload: Upload): Promise<string> {
  const key = getS3UploadFileKey(upload.agency.organizationId, upload)
  const s3 = getS3Client()
  const baseParams = { Bucket: REPORTING_DATA_BUCKET_NAME, Key: key }
  return awsGetSignedUrl(s3, new GetObjectCommand(baseParams), {
    expiresIn: 60,
  })
}

function getSQSClient() {
  let sqs: SQSClient
  if (process.env.LOCALSTACK_HOSTNAME) {
    console.log('------------ USING LOCALSTACK FOR SQS ------------')
    const endpoint = `http://${process.env.LOCALSTACK_HOSTNAME}:${
      process.env.EDGE_PORT || 4566
    }`
    sqs = new SQSClient({ endpoint, region: process.env.AWS_DEFAULT_REGION })
  } else {
    sqs = new SQSClient()
  }
  return sqs
}

async function sendSqsMessage(queueUrl: string, messageBody: unknown) {
  const sqs = getSQSClient()
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    })
  )
}

async function receiveSqsMessage(queueUrl: string) {
  const sqs = getSQSClient()
  // const receiveResp = await sqs.send(new ReceiveMessageCommand({
  //   QueueUrl: process.env.TASK_QUEUE_URL, WaitTimeSeconds: 20, MaxNumberOfMessages: 1,
  // }));

  // const receiveResp = await sqs.send(new ReceiveMessageCommand({
  //   QueueUrl: process.env.TASK_QUEUE_URL, WaitTimeSeconds: 20, MaxNumberOfMessages: 1,
  // }));

  await sqs.send(
    new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      WaitTimeSeconds: 20,
      MaxNumberOfMessages: 1,
    })
  )
}

/**
 * Create a step function execution.
 * AWS docs can be found at the following:
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sfn/command/StartExecutionCommand/
 *
 * For localstack docs, see https://docs.localstack.cloud/user-guide/aws/stepfunctions/
 *
 * @param arn
 * @param name
 * @param input
 * @param traceHeader
 */
async function startStepFunctionExecution(
  arn: string,
  name?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input?: any,
  traceHeader?: string
): Promise<StartExecutionCommandOutput> {
  let client: SFNClient
  const command = new StartExecutionCommand({
    stateMachineArn: arn,
    name,
    input: input ?? '{}',
    traceHeader,
  })
  if (process.env.LOCALSTACK_HOSTNAME) {
    console.log('------------ USING LOCALSTACK FOR SFN ------------')
    const endpoint = `http://${process.env.LOCALSTACK_HOSTNAME}:${
      process.env.EDGE_PORT || 4566
    }`
    client = new SFNClient({ endpoint, region: process.env.AWS_DEFAULT_REGION })
  } else {
    client = new SFNClient()
  }
  return await client.send(command)
}

export default {
  sendPutObjectToS3Bucket,
  sendHeadObjectToS3Bucket,
  getSignedUrl,
  sendSqsMessage,
  receiveSqsMessage,
  getS3Client,
  startStepFunctionExecution,
  s3DeleteObject,
}
