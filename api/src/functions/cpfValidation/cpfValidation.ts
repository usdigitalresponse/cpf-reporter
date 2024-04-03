import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { NodeJsClient } from '@smithy/types'
import { S3Event, S3Handler } from 'aws-lambda'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

const s3 = new S3Client({}) as NodeJsClient<S3Client>

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

type UploadValidationS3Client = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (command: GetObjectCommand | DeleteObjectCommand) => Promise<any>
}

export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        await processRecord(record, s3, db)
      } catch (err) {
        logger.error(`Handler error: ${err}`)
      }
    })
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const processRecord = async (
  record: UploadValidationRecord,
  s3Client: UploadValidationS3Client,
  database: any
): Promise<void> => {
  const bucket = record.s3.bucket.name
  const key = record.s3.object.key

  // Download the JSON errors file from S3
  const getObjectResponse = await s3Client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  )

  // Add the contents of the JSON to the database
  if (getObjectResponse.Body) {
    /* example file path/key
         /uploads/organization_id/agency_id/reporting_period_id/upload_id/{filename}
      */
    const result = JSON.parse(getObjectResponse.Body.toString()) || []

    // when the results array is empty then we know the file has passed validations
    const passed = result.length === 0

    const uploadId = extractUploadIdFromKey(key)
    const input = {
      results: result,
      uploadId: uploadId,
      passed: passed,
    }
    console.log('Updating upload id', uploadId)
    console.log('Setting results to ', result)
    // There should be an existing validation Record in the DB that will need to be updated
    console.log(
      'Total validation records',
      await database.uploadValidation.count()
    )
    const firstRecord = await database.uploadValidation.findFirst()
    console.log('first record in the db', firstRecord)
    const validationRecord = await database.uploadValidation.updateMany({
      data: input,
      where: { uploadId },
    })
    console.log(`Records updated: ${validationRecord.count}`)
    if (!validationRecord || validationRecord.count === 0) {
      logger.error('Validation record not found')
      throw new Error('Validation record not found')
    }

    // Delete the errors.json file from S3
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )
  } else {
    logger.warn('No body in getObjectResponse')
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
