import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

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
  latestSubrecipientUpload: async (_obj, { root }) => {
    return db.subrecipientUpload.findFirst({
      where: { subrecipientId: root?.id },
      orderBy: {
        updatedAt: 'desc',
      },
    })
  },
  latestValidSubrecipientUpload: async (_obj, { root }) => {
    const latestValidSubrecipientUpload = await db.subrecipientUpload.findFirst(
      {
        where: { subrecipientId: root?.id },
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
      }
    )

    if (
      latestValidSubrecipientUpload &&
      latestValidSubrecipientUpload.upload.validations[0]?.passed
    ) {
      return latestValidSubrecipientUpload
    }

    return null
  },
  validSubrecipientUploads: async (_obj, { root }) => {
    const uploads = await db.subrecipientUpload.findMany({
      where: {
        subrecipientId: root?.id,
        upload: {
          validations: { some: { passed: true } },
        },
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

    const transformedUploads = uploads.map((upload) => ({
      ...upload,
      upload: {
        ...upload.upload,
        latestValidation: upload.upload.validations[0] || null,
      },
    }))

    // Only include parsedSubrecipient for the latest upload
    // if (transformedUploads.length > 0) {
    //   transformedUploads[0].parsedSubrecipient = await getParsedSubrecipient(transformedUploads[0])
    // }

    return transformedUploads
  },
  invalidAndProcessingSubrecipientUploads: async (_obj, { root }) => {
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

    // Filter the subrecipientUploads based on the latest validation of their associated upload
    const invalidAndProcessingUploads = subrecipientUploads.filter(
      (subrecipientUpload) => {
        const latestValidation = subrecipientUpload.upload.validations[0]
        return latestValidation && latestValidation.passed === false
      }
    )

    return invalidAndProcessingUploads
  },
}
