import { v4 as uuidv4 } from "uuid"
import {
  CreateBucketCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteBucketCommand,
  DeleteBucketCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getPrismaClient } from 'api/src/lib/db'
import AWS from 'api/src/lib/aws'

const REPORTING_DATA_BUCKET_NAME = `test-${process.env.REPORTING_DATA_BUCKET_NAME}-${uuidv4()}`

export default async () => {
  const s3 = AWS.getS3Client()
  await getPrismaClient()
  const key = "12345"

  console.log("Create bucket")
  try {
    await s3.send(new CreateBucketCommand({
      Bucket: REPORTING_DATA_BUCKET_NAME,
    }))
    console.log("-- Bucket created")
  } catch (error) {
    if (error.Code == "BucketAlreadyOwnedByYou") {
      console.log("-- Bucket already exists")
    } else {
      console.log(error)
    }
  }

  const baseParams: GetObjectCommandInput = {
    Bucket: REPORTING_DATA_BUCKET_NAME,
    Key: key,
  }
  try {
    console.log("Create signed URL")
    const url = await awsGetSignedUrl(s3, new GetObjectCommand(baseParams), {
      expiresIn: 60,
    })
    console.log("-- signed url", url)

    console.log("Upload file")
    const uploadParams: PutObjectCommandInput = {
      Body: "tests3.ts",  // Upload this file as a test
      Bucket: REPORTING_DATA_BUCKET_NAME,
      Key: key,
    }
    await s3.send(new PutObjectCommand(uploadParams))

    console.log("-- Look at uploaded file")
    const headParams: HeadObjectCommandInput = {
      Bucket: REPORTING_DATA_BUCKET_NAME,
      Key: key,
    }
    const response = await s3.send(new HeadObjectCommand(headParams))
    console.log("--", response)

    console.log("Delete file")
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: REPORTING_DATA_BUCKET_NAME,
      Key: key,
    }
    await s3.send(new DeleteObjectCommand(deleteParams))
    console.log("-- file deleted")
  } catch (error) {
    console.warn('Failed to test s3.')
    console.error(error)
  } finally {
    console.log("Remove bucket")
    await s3.send(new DeleteBucketCommand({
      Bucket: REPORTING_DATA_BUCKET_NAME,
    } as DeleteBucketCommandInput))
    console.log("-- Bucket removed")
  }
}
