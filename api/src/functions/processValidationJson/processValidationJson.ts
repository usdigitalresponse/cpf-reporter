import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Prisma } from '@prisma/client'
import { NodeJsClient } from '@smithy/types'
import { S3Handler, S3ObjectCreatedNotificationEvent } from 'aws-lambda'

import aws from 'src/lib/aws'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

type UploadValidationRecord = {
  s3: {
    bucket: {
      name: string
    }
    object: {
      key: string
    }
  }
}
type Response = {
  statusCode: number
}

type UploadValidationS3Client = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (command: GetObjectCommand | DeleteObjectCommand) => Promise<any>
}

export const handler: S3Handler = async (
  event: S3ObjectCreatedNotificationEvent
): Promise<Response> => {
  const s3 = aws.getS3Client()
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await processRecord(record, s3)
      } catch (err) {
        logger.error(`Handler error: ${err}`)
      }
    })
  )
  return {
    statusCode: 200,
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const processRecord = async (
  record: UploadValidationRecord,
  s3Client: UploadValidationS3Client
): Promise<void> => {
  const bucket = record.s3.bucket.name
  const key = record.s3.object.key

  // Download the JSON errors file from S3
  let getObjectResponse
  try {
    getObjectResponse = await s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    )
  } catch (err) {
    logger.error(`Error getting object from S3: ${err} - key: ${key}`)
    throw new Error('Error getting object from S3')
  }

  // Add the contents of the JSON to the database
  if (getObjectResponse.Body) {
    /* example file path/key
         /uploads/organization_id/agency_id/reporting_period_id/upload_id/{filename}
      */
    const strBody = await getObjectResponse.Body.transformToString()
    const result = JSON.parse(strBody) || []

    // when the results array is empty then we know the file has passed validations
    const passed = result.length === 0

    const uploadId = extractUploadIdFromKey(key)
    const input = {
      results: result,
      uploadId: uploadId,
      passed: passed,
    }

    // There should be an existing validation Record in the DB that will need to be updated
    const validationRecord = await db.uploadValidation.findFirst({
      where: { uploadId, passed: false, results: { equals: Prisma.JsonNull } },
      orderBy: { createdAt: 'desc' },
    })
    if (!validationRecord) {
      logger.error('Validation record not found')
      throw new Error('Validation record not found')
    }

    try {
      await db.uploadValidation.update({
        data: input,
        where: { id: validationRecord.id },
      })
    } catch (err) {
      logger.error(
        `Error updating validation record: ${err} - key: ${key} - record: ${validationRecord.id}`
      )
      throw new Error('Error updating validation record')
    }

    // Delete the errors.json file from S3
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      )
    } catch (err) {
      logger.error(`Error deleting object from S3: ${err} - key: ${key}`)
      throw new Error('Error deleting object from S3')
    }
  } else {
    logger.error('No body in getObjectResponse')
  }
}

function extractUploadIdFromKey(key: string): number {
  logger.debug(`Extracting upload_id from key: ${key}`)
  const regex =
    /\/uploads\/(?<organization_id>\w+)\/(?<agency_id>\w+)\/(?<reporting_period_id>\w+)\/(?<upload_id>\w+)\/(?<filename>.+)/
  const match = key.match(regex)
  if (!match) {
    throw new Error('Invalid key format')
  }
  logger.info(`Extracted upload_id: ${match.groups.upload_id}`)
  return parseInt(match.groups.upload_id)
}
