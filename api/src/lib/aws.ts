import {
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import {
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import { StreamingBlobPayloadInputTypes } from '@smithy/types'
import { QueryResolvers, CreateUploadInput } from 'types/graphql'

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

export function uploadWorkbook(
  upload: CreateUploadInput,
  uploadId: number,
  body: StreamingBlobPayloadInputTypes
) {
  const folderName = `uploads/${upload.organizationId}/${upload.agencyId}/${upload.reportingPeriodId}/${uploadId}/${upload.filename}`
  return sendPutObjectToS3Bucket(REPORTING_DATA_BUCKET_NAME, folderName, body)
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

export async function s3PutSignedUrl(
  upload: CreateUploadInput,
  uploadId: number
): Promise<string> {
  const s3 = getS3Client()
  const key = `uploads/${upload.organizationId}/${upload.agencyId}/${upload.reportingPeriodId}/${uploadId}/${upload.filename}`
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

/**
 *  This function is a wrapper around the getSignedUrl function from the @aws-sdk/s3-request-presigner package.
 *  Exists to organize the imports and to make it easier to mock in tests.
 */
async function getSignedUrl(bucketName: string, key: string) {
  const s3 = getS3Client()
  const baseParams = { Bucket: bucketName, Key: key }
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

export const s3PutObjectSignedUrl: QueryResolvers['s3PutObjectSignedUrl'] = ({
  upload,
  uploadId,
}) => {
  return s3PutSignedUrl(upload, uploadId)
}

export default {
  sendPutObjectToS3Bucket,
  sendHeadObjectToS3Bucket,
  getSignedUrl,
  sendSqsMessage,
  receiveSqsMessage,
}
