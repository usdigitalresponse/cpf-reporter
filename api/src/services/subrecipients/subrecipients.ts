import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientRelationResolvers,
} from 'types/graphql'

import { sendPutObjectToS3Bucket } from 'src/lib/aws'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

export const subrecipients: QueryResolvers['subrecipients'] = () => {
  const currentUser = context.currentUser

  return db.subrecipient.findMany({
    where: {
      organizationId: currentUser.agency.organizationId,
    },
  })
}

export const subrecipient: QueryResolvers['subrecipient'] = ({ id }) => {
  return db.subrecipient.findUnique({
    where: { id },
  })
}

export const createSubrecipient: MutationResolvers['createSubrecipient'] = ({
  input,
}) => {
  return db.subrecipient.create({
    data: input,
  })
}

export const updateSubrecipient: MutationResolvers['updateSubrecipient'] = ({
  id,
  input,
}) => {
  return db.subrecipient.update({
    data: input,
    where: { id },
  })
}

export const deleteSubrecipient: MutationResolvers['deleteSubrecipient'] = ({
  id,
}) => {
  return db.subrecipient.delete({
    where: { id },
  })
}

export const uploadSubrecipients: MutationResolvers['uploadSubrecipients'] =
  async ({ input }) => {
    const { organizationId } = input
    const organization = await db.organization.findUnique({
      where: { id: organizationId },
    })
    const reportingPeriod = await db.reportingPeriod.findFirst({
      where: { id: organization.preferences?.current_reporting_period_id },
    })
    if (!organization || !reportingPeriod) {
      throw new Error('Organization or reporting period not found')
    }

    try {
      const subrecipientKey = `treasuryreports/${organization.id}/${reportingPeriod.id}/subrecipients.json`

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
          organizationId: organization.id,
        },
        include: { subrecipientUploads: true },
      })
      const subrecipients = {
        subrecipients: subrecipientsWithUploads,
      }
      await sendPutObjectToS3Bucket(
        `${process.env.REPORTING_DATA_BUCKET_NAME}`,
        subrecipientKey,
        JSON.stringify(subrecipients)
      )
      return {
        message: 'Subrecipients uploaded successfully',
        success: true,
        countSubrecipients: subrecipientsWithUploads.length,
      }
    } catch (err) {
      logger.error(`Error saving subrecipients JSON file to S3: ${err}`)
      throw new Error('Error saving subrecipient info to S3')
    }
  }

export const Subrecipient: SubrecipientRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
  subrecipientUploads: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .subrecipientUploads()
  },
  validSubrecipientUploads: async (_obj, { root }) => {
    const uploads = await db.subrecipientUpload.findMany({
      where: {
        subrecipientId: root?.id,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        upload: {
          include: {
            validations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    })

    return uploads.filter(
      (upload) =>
        upload.upload.validations.length > 0 &&
        upload.upload.validations[0].passed
    )
  },
  invalidSubrecipientUploads: async (_obj, { root }) => {
    const subrecipientUploads = await db.subrecipientUpload.findMany({
      where: {
        subrecipientId: root?.id,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        upload: {
          include: {
            validations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    })

    return subrecipientUploads.filter(
      (upload) =>
        upload.upload.validations.length > 0 &&
        upload.upload.validations[0].results !== null &&
        !upload.upload.validations[0].passed
    )
  },
}
