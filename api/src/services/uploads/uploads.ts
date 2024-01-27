import type {
  QueryResolvers,
  MutationResolvers,
  UploadRelationResolvers,
} from 'types/graphql'

import { s3PutSignedUrl } from 'src/lib/aws'
import { db } from 'src/lib/db'
export const uploads: QueryResolvers['uploads'] = () => {
  return db.upload.findMany()
}

export const upload: QueryResolvers['upload'] = ({ id }) => {
  return db.upload.findUnique({
    where: { id },
  })
}

export const createUpload: MutationResolvers['createUpload'] = async ({
  input,
}) => {
  // validateUpload(input, context.currentUser)
  const upload = await db.upload.create({
    data: input,
  })

  upload.signedUrl = await s3PutSignedUrl(upload, upload.id)
  return upload
}

// This runs when user clicks "Validate" button or "Re-Validate" button
export const triggerUploadValidation: MutationResolvers['triggerUploadValidation'] = async ({ id }) => {
  // "reviewType" can be invalid or valid
  // "reviewResults" can be null or have errors

  // const upload = await services.CPFValidationService.validateUpload(input)

   const upload = await db.upload.findUnique({
      where: { id },
    })

  // console.log('latestValidation', upload.latestValidation)
  // console.log('reviewType', upload.latestValidation.reviewType)
  // console.log('reviewResults', upload.latestValidation.reviewResults)

  return upload;
}

// Runs when user clicks "Invalidate" and is always of reviewType INVALIDATED
// You can invalidate a file even if you don't get any erros
export const forceInvalidateUpload: MutationResolvers['forceInvalidateUpload'] = async ({ id }) => {
  const upload = await db.upload.findUnique({
    where: { id },
  })

  await db.uploadValidation.create({
    data: {
      uploadId: id,
      agencyId: upload.agencyId,
      organizationId: upload.organizationId,
      inputTemplateId: upload.expenditureCategoryId,
      reviewType: 'INVALIDATED',
    },
  });

  return upload;
}

// !DO NOT USE THIS
// export const validateUpload: MutationResolvers['validateUpload'] = async ({
//   input,
// }) => {
//   // const upload = await db.upload.create({
//   //   data: input,
//   // })

//   const uploadValidation = await db.uploadValidation.create({});

//   // const upload = await services.CPFValidationService.validateUpload(input)

//   //  const upload = await db.upload.findUnique({
//   //     where: { id: input },
//   //   })

//   // console.log('latestValidation', upload.latestValidation)
//   // console.log('reviewType', upload.latestValidation.reviewType)
//   // console.log('reviewResults', upload.latestValidation.reviewResults)


//   // upload.signedUrl = await s3PutSignedUrl(upload, upload.id)
//   return uploadValidation
// }

export const updateUpload: MutationResolvers['updateUpload'] = ({
  id,
  input,
}) => {
  return db.upload.update({
    data: input,
    where: { id },
  })
}

export const deleteUpload: MutationResolvers['deleteUpload'] = ({ id }) => {
  return db.upload.delete({
    where: { id },
  })
}

export const Upload: UploadRelationResolvers = {
  uploadedBy: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).uploadedBy()
  },
  agency: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).agency()
  },
  organization: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).organization()
  },
  reportingPeriod: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).reportingPeriod()
  },
  expenditureCategory: (_obj, { root }) => {
    return db.upload
      .findUnique({ where: { id: root?.id } })
      .expenditureCategory()
  },
  validations: (_obj, { root }) => {
    return db.upload.findUnique({ where: { id: root?.id } }).validations()
  },
  latestValidation: async (_obj, { root }) => {
    console.log('root', root)
    console.log('here')
    console.log('_obj', _obj)
    const latestValidation = await db.uploadValidation.findFirst({
      where: { uploadId: root?.id },
      orderBy: {
        reviewedAt: 'desc',
      },
    })
    return latestValidation
  },
}
