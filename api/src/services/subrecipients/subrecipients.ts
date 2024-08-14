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

    return uploads
  },
  invalidSubrecipientUploads: async (_obj, { root }) => {
    const subrecipientUploads = await db.subrecipientUpload.findMany({
      where: {
        subrecipientId: root?.id,
        upload: {
          validations: {
            some: {
              passed: false,
              results: { not: null },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        upload: {
          include: {
            validations: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              where: {
                passed: false,
                results: { not: null },
              },
            },
          },
        },
      },
    })
    return subrecipientUploads || []

    // const subrecipientUploads = await db.subrecipientUpload.findMany({
    //   where: {
    //     subrecipientId: root?.id,
    //   },
    //   orderBy: { updatedAt: 'desc' },
    //   include: {
    //     upload: {
    //       include: {
    //         validations: {
    //           orderBy: { createdAt: 'desc' },
    //           take: 1,
    //           where: {
    //             passed: false,
    //             results: { not: null },
    //           },
    //         },
    //       },
    //     },
    //   },
    // })
    // console.log('subrecipientUploads', subrecipientUploads)
    // return subrecipientUploads
  },
}
