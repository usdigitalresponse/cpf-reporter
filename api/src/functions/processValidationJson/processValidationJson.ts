import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Prisma, Version } from '@prisma/client'
import { S3ObjectCreatedNotificationEvent } from 'aws-lambda'

import { getS3Client, sendPutObjectToS3Bucket } from 'src/lib/aws'
import { db, getPrismaClient } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export enum Severity {
  Error = 'ERR',
  Warning = 'WARN',
  Info = 'INFO',
}

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

type Subrecipient = {
  Name: string
  EIN__c: string
  Unique_Entity_Identifier__c: string
  // Look at SubrecipientRow in the latest Python schema file for the full range of what we can pull out here if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

type ResultSchema = {
  errors: {
    severity: Severity
    message: string
    tab?: string
    row?: string
    col?: string
  }[]
  projectUseCode: string
  subrecipients: Subrecipient[]
  versionString: string
}

type UploadValidationS3Client = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send: (command: GetObjectCommand | DeleteObjectCommand) => Promise<any>
}

export const handler = async (
  event: S3ObjectCreatedNotificationEvent
): Promise<Response> => {
  const s3 = getS3Client()
  if (process.env.LOCALSTACK_HOSTNAME) {
    /*
    This allows us to easily test this function during local development by making a GET request as follows:
    http://localhost:8911/processValidationJson?Records[0][s3][bucket][name]=cpf-reporter&Records[0][s3][object][key]=/uploads/1/2/3/14/test.json
    {
      "Records":[
          {
            "s3":{
                "bucket":{
                  "name":"cpf-reporter"
                },
                "object":{
                  "key":"/uploads/1/2/3/4/test.json"
                }
            }
          }
      ]
    }

    Ensure that the local environment has the following object setup in S3:
    awslocal s3api put-object \
      --bucket cpf-reporter \
      --key /uploads/1/2/3/16/test.json \
      --body test.json
    Verify that the database has a record with the upload_id of 16 in the `UploadValidation` table where passed: false and results: null.
    */
    event = event.queryStringParameters
  }
  await getPrismaClient()
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
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))

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
    const result: ResultSchema = JSON.parse(strBody) || []

    // when the results array is empty then we know the file has passed validations
    const passed =
      (result?.errors || []).filter((e) => e.severity == Severity.Error)
        .length === 0

    const uploadId = extractUploadIdFromKey(key)

    if (result.projectUseCode) {
      // Verify valid expenditureCategory
      /*
    The category must be one of the following values:
      {
        name: '1A - Broadband Infrastructure',
        code: '1A',
      },
      {
        name: '1B - Digital Connectivity Technology',
        code: '1B',
      },
      {
        name: '1C - Multi-Purpose Community Facility',
        code: '1C',
      },
    */
      const expenditureCategory = await db.expenditureCategory.findFirst({
        where: { code: result.projectUseCode },
      })
      if (!expenditureCategory) {
        logger.error(
          `Expenditure category not found: ${result.projectUseCode} - key: ${key}`
        )
        throw new Error('Expenditure category not found')
      }

      // Update the Upload record with the expenditure category Id
      await db.upload.update({
        data: { expenditureCategoryId: expenditureCategory.id },
        where: { id: uploadId },
      })
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

    const uploadValidationInput = {
      results: result,
      uploadId: uploadId,
      passed: passed,
    }

    try {
      await db.uploadValidation.update({
        data: uploadValidationInput,
        where: { id: validationRecord.id },
      })
    } catch (err) {
      logger.error(
        `Error updating validation record: ${err} - key: ${key} - record: ${validationRecord.id}`
      )
      throw new Error('Error updating validation record')
    }

    // If we passed validation, we will save the subrecipient info into our DB
    if (passed && result.subrecipients?.length) {
      await handleSubrecipientUploads(result, key, uploadId, bucket)
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

async function handleSubrecipientUploads(result, key, uploadId, bucket) {
  const organizationId = extractOrganizationIdFromKey(key)
  for (const subrecipient of result.subrecipients) {
    await saveSubrecipientInfo(
      subrecipient,
      key,
      uploadId,
      result.versionString,
      organizationId
    )
  }

  let reportingPeriod
  try {
    reportingPeriod = (
      await db.upload.findUnique({
        where: { id: uploadId },
        include: { reportingPeriod: true },
      })
    ).reportingPeriod
  } catch (err) {
    logger.error(`Could not find reporting period for upload ${uploadId}`)
    throw new Error('Error determining reporting period for upload')
  }

  try {
    const subrecipientsWithUploads = await getNewlyCreatedSubrecipients(
      reportingPeriod,
      organizationId
    )
    const subrecipients = {
      subrecipients: subrecipientsWithUploads,
    }
    const subrecipientKey = `treasuryreports/${organizationId}/${reportingPeriod.id}/subrecipients.json`
    await sendPutObjectToS3Bucket(
      bucket,
      subrecipientKey,
      JSON.stringify(subrecipients)
    )
    logger.info(
      `Successfully saved subrecipients to S3: ${subrecipientsWithUploads.length}`
    )
  } catch (err) {
    logger.error(`Error saving subrecipients JSON file to S3: ${err}`)
    throw new Error('Error saving subrecipient info to S3')
  }
}

async function getNewlyCreatedSubrecipients(reportingPeriod, organizationId) {
  // Get all subrecipients for the current reporting period
  // These subrecipients are considered for the report if they were created
  // during the month following the end of the reporting period
  // For example: if the reporting period ends on 2022-03-31,
  // any subrecipients created between 2022-04-01 and 2022-04-30 are new

  const startDate = new Date(
    reportingPeriod.endDate.getFullYear(),
    reportingPeriod.endDate.getMonth() + 1,
    1
  )
  const endDate = new Date(
    reportingPeriod.endDate.getFullYear(),
    reportingPeriod.endDate.getMonth() + 2,
    0
  )
  const subrecipientsWithUploads = await db.subrecipient.findMany({
    where: {
      createdAt: { lte: endDate, gte: startDate },
      organizationId,
    },
    include: { subrecipientUploads: true },
  })

  return subrecipientsWithUploads
}

async function saveSubrecipientInfo(
  subrecipientInput: Subrecipient,
  key: string,
  uploadId: number,
  versionString: string,
  organizationId: number
) {
  let version = Version[versionString]
  if (!version) {
    version = Version.V2024_05_24
    logger.error(
      `Error obtaining version from version passed in results ${versionString}, falling back on ${version}`
    )
  }

  try {
    const ueiTinCombo = `${subrecipientInput.Unique_Entity_Identifier__c}_${subrecipientInput.EIN__c}`
    // Per documentation here: https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records
    // providing an empty `update` block in `upsert` is essentially a "findOrCreate" operation, which works as long as you're selecting on a field that is unique
    const subrecipient = await db.subrecipient.upsert({
      where: { ueiTinCombo },
      create: {
        name: subrecipientInput.Name,
        ueiTinCombo,
        organizationId,
      },
      update: {},
    })
    await db.subrecipientUpload.upsert({
      create: {
        subrecipientId: subrecipient.id,
        uploadId,
        rawSubrecipient: subrecipientInput,
        version,
      },
      update: {
        rawSubrecipient: subrecipientInput,
      },
      where: {
        subrecipientId_uploadId: { subrecipientId: subrecipient.id, uploadId },
      },
    })
  } catch (err) {
    logger.error(
      `Error saving subrecipient: ${err} - key: ${key} - subrecipient: ${subrecipientInput.Name}`
    )
    throw new Error('Error saving subrecipient')
  }
}

function extractUploadIdFromKey(key: string): number {
  logger.debug(`Extracting upload_id from key: ${key}`)
  const match = matchRegex(key)
  logger.info(`Extracted upload_id: ${match.groups.upload_id}`)
  return parseInt(match.groups.upload_id)
}

function extractOrganizationIdFromKey(key: string): number {
  logger.debug(`Extracting organization id from key: ${key}`)
  const match = matchRegex(key)
  logger.info(`Extracted organization_id: ${match.groups.organization_id}`)
  return parseInt(match.groups.organization_id)
}

function matchRegex(key: string): RegExpMatchArray {
  const regex =
    /uploads\/(?<organization_id>\w+)\/(?<agency_id>\w+)\/(?<reporting_period_id>\w+)\/(?<upload_id>\w+)\/(?<filename>.+)/
  const match = key.match(regex)
  if (!match) {
    throw new Error('Invalid key format')
  }
  return match
}
