import { https } from 'https'

import { S3Event, S3Handler } from 'aws-lambda'

import { logger } from 'src/lib/logger'

const apiEndpoint = 'https://example.com'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const handler: S3Handler = async (event: S3Event): Promise<void> => {
  try {
    const bucket = event.Records[0].s3.bucket.name
    const key = event.Records[0].s3.object.key

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    // call API endpoint with S3 key
    https.request(apiEndpoint, options, (res) => {})
  } catch (error) {
    logger.error('Error processing S3 event:', error)
    throw error
  }
}
