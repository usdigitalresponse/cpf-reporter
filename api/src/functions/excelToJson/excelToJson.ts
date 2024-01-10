import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { NodeJsClient } from '@smithy/types'
import { S3Event, S3Handler } from 'aws-lambda'
import { Workbook } from 'exceljs'

import { logger } from 'src/lib/logger'

const s3 = new S3Client({}) as NodeJsClient<S3Client>

export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  try {
    const bucket = event.Records[0].s3.bucket.name
    const key = event.Records[0].s3.object.key

    // Download the Excel file from S3
    const getObjectResponse = await s3.send(
      new GetObjectCommand({ Bucket: bucket, Key: key })
    )

    if (getObjectResponse.Body) {
      new Workbook().xlsx.read(getObjectResponse.Body)
      const workbook = new Workbook()

      const worksheet = workbook.worksheets[0]
      const jsonData = worksheet.getSheetValues()

      // Write JSON data to a file
      const jsonFileName = `${key}.json` // Use the same key with .json extension
      const jsonFileContent = JSON.stringify(jsonData)

      // Upload the JSON file to the same bucket
      s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: jsonFileName,
          Body: jsonFileContent,
          ContentType: 'application/json',
        })
      )
    }
  } catch (error) {
    logger.error('Error processing S3 event:', error)
    throw error
  }
}
