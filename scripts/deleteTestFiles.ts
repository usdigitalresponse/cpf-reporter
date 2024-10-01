// To access your database
// Append api/* to import from api and web/* to import from web
import { db, getPrismaClient } from 'api/src/lib/db'
import { deleteUpload } from 'api/src/services/uploads/uploads'

export default async ({ args }) => {
  /*
  Useful to reset a new organization by deleting any unnecessary uploads.

  Example:
    yarn redwood exec deleteTestFiles \
      --orgName 'Sample Org' \
      --uploadIds '[1, 2, 3]'
  */
  await getPrismaClient()
  console.log(':: Executing script with args ::')
  console.log(`Received following arguments: ${Object.keys(args)}`)

  if (!args.orgName) {
    throw new Error('Organization name is required')
  }
  // for every upload in the organization. delete the uploadvaliation, upload, and file from s3
  const organization = await db.organization.findFirst({
    where: { name: args.orgName },
  })
  if (!organization) {
    throw new Error(`Organization ${args.orgName} not found`)
  }
  console.log(`Organization found: ${organization.name}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    agency: { organizationId: organization.id },
  }

  if (args.uploadIds) {
    // only delete the uploads that were requested by the user
    whereClause.id = { in: JSON.parse(args.uploadIds) }
  }

  // find all the relevant uploads
  const uploads = await db.upload.findMany({
    where: whereClause,
  })

  // iterate through every upload and delete it
  for (const upload of uploads) {
    console.log(`Deleting upload ${upload.id}`)
    await deleteUpload({ id: upload.id })
  }

  console.log(':: Script executed ::')
}
