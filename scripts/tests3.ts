import {
  GetObjectCommand,
  CreateBucketCommand,
  HeadObjectCommand,
  HeadObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Prisma } from '@prisma/client'
import { db, getPrismaClient } from 'api/src/lib/db'
import AWS from 'api/src/lib/aws'

const REPORTING_DATA_BUCKET_NAME = `${process.env.REPORTING_DATA_BUCKET_NAME}`

export default async () => {
  try {
    await getPrismaClient()

    const s3 = AWS.getS3Client()
    const key = "12345"
    const baseParams: PutObjectCommandInput = {
      Bucket: REPORTING_DATA_BUCKET_NAME,
      Key: key,
      ContentType: 'application/vnd.ms-excel.sheet.macroenabled.12',
      ServerSideEncryption: 'AES256',
    }
    const url = await awsGetSignedUrl(s3, new PutObjectCommand(baseParams), {
      expiresIn: 60,
    })
    console.log("url", url)

    const uploadParams: HeadObjectCommandInput = {
      Bucket: REPORTING_DATA_BUCKET_NAME,
      Key: key,
    }
    await s3.send(new CreateBucketCommand({
      Bucket: REPORTING_DATA_BUCKET_NAME,
    }))
    await s3.send(new HeadObjectCommand(uploadParams))
  

  } catch (error) {
    console.warn('Failed to test s3.')
    console.error(error)
  }
}
