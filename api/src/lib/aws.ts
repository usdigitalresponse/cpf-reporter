import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import {ReceiveMessageCommand, SendMessageCommand, SQSClient} from '@aws-sdk/client-sqs'
import {getSignedUrl as awsGetSignedUrl} from '@aws-sdk/s3-request-presigner'

function getS3Client() {
  let s3: S3Client;
  if (process.env.LOCALSTACK_HOSTNAME) {
    /*
        1. Make sure the local environment has awslocal installed.
        2. Use the commands to create a bucket to test with.
            - awslocal s3api create-bucket --bucket arpa-audit-reports --region us-west-2 --create-bucket-configuration '{"LocationConstraint": "us-west-2"}'
        3. Access bucket resource metadata through the following URL.
            - awslocal s3api list-buckets
            - awslocal s3api list-objects --bucket arpa-audit-reports
    */
    console.log('------------ USING LOCALSTACK ------------');
    const endpoint = `http://${process.env.LOCALSTACK_HOSTNAME}:${process.env.EDGE_PORT || 4566}`;
    console.log(`endpoint: ${endpoint}`);
    s3 = new S3Client({
      endpoint,
      forcePathStyle: true,
      region: process.env.AWS_DEFAULT_REGION,
    });
  } else {
    s3 = new S3Client();
  }
  return s3;
}

async function sendPutObjectToS3Bucket(bucketName: string, key: string, body: any) {
  const s3 = getS3Client();
  const uploadParams : PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ServerSideEncryption: 'AES256',
  };
  await s3.send(new PutObjectCommand(uploadParams));
}

async function sendHeadObjectToS3Bucket(bucketName: string, key: string) {
  const s3 = getS3Client();
  const uploadParams : PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };
  await s3.send(new PutObjectCommand(uploadParams));
}

/**
 *  This function is a wrapper around the getSignedUrl function from the @aws-sdk/s3-request-presigner package.
 *  Exists to organize the imports and to make it easier to mock in tests.
 */
async function getSignedUrl(bucketName: string, key: string) {
  const s3 = getS3Client();
  const baseParams = { Bucket: bucketName, Key: key };
  return awsGetSignedUrl(s3, new GetObjectCommand(baseParams), { expiresIn: 60 });
}

function getSQSClient() {
  let sqs: SQSClient;
  if (process.env.LOCALSTACK_HOSTNAME) {
    console.log('------------ USING LOCALSTACK FOR SQS ------------');
    const endpoint = `http://${process.env.LOCALSTACK_HOSTNAME}:${process.env.EDGE_PORT || 4566}`;
    sqs = new SQSClient({ endpoint, region: process.env.AWS_DEFAULT_REGION });
  } else {
    sqs = new SQSClient();
  }
  return sqs;
}

async function sendSqsMessage(queueUrl: string, messageBody: any) {
  const sqs = getSQSClient();
  await sqs.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  }));
}

async function receiveSqsMessage(queueUrl: string) {
  const sqs = getSQSClient();
  // const receiveResp = await sqs.send(new ReceiveMessageCommand({
  //   QueueUrl: process.env.TASK_QUEUE_URL, WaitTimeSeconds: 20, MaxNumberOfMessages: 1,
  // }));

  // const receiveResp = await sqs.send(new ReceiveMessageCommand({
  //   QueueUrl: process.env.TASK_QUEUE_URL, WaitTimeSeconds: 20, MaxNumberOfMessages: 1,
  // }));

  await sqs.send(new ReceiveMessageCommand({
    QueueUrl: queueUrl, WaitTimeSeconds: 20, MaxNumberOfMessages: 1,
  }));
}

export default {
  sendPutObjectToS3Bucket,
  sendHeadObjectToS3Bucket,
  getSignedUrl,
  sendSqsMessage,
  receiveSqsMessage,
};
