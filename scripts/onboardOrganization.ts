// To access your database
// Append api/* to import from api and web/* to import from web
import { db, getPrismaClient } from 'api/src/lib/db'
import {
  createPassageUser,
} from 'api/src/services/passage/passage'
import type { Prisma } from '@prisma/client'
import {
  getOrCreateOrganization
} from 'api/src/services/organizations/organizations'
import {
  getOrCreateAgencies
} from 'api/src/services/agencies/agencies'
import { getOrCreateUsers } from 'api/src/services/users/users'

async function addOrgAgencyUsers(orgName, agencyInfo, userInfo) {
  const organizationRecord = await getOrCreateOrganization(orgName)
  await getOrCreateAgencies(organizationRecord, agencyInfo)
  getOrCreateUsers(userInfo, organizationRecord)
}

export default async ({ args }) => {
  /*
  yarn redwood exec onboardOrganization \
    --orgName 'Sample Org' \
    --agencyInfo '[
      {"name": "Sample Agency", "abbreviation": "SA", "code": "SA"},
      {"name": "Sample Agency 2", "abbreviation": "SA2", "code": "SA2"}
    ]' \
    --userInfo '[
      {"name": "Sample User", "email": "sample@example.com", "role": "ORGANIZATION_STAFF", "agencyName": "Sample Agency"},
      {"name": "Sample User 2", "email": "sample2@example.com", "role": "ORGANIZATION_ADMIN", "agencyName": "Sample Agency 2"}
    ]'
  */
  await getPrismaClient()
  console.log(':: Executing script with args ::')
  console.log(args)
  console.log(JSON.parse(args.agencyInfo))
  console.log(JSON.parse(args.userInfo))
  await addOrgAgencyUsers(args.orgName, JSON.parse(args.agencyInfo), JSON.parse(args.userInfo))
  console.log(':: Script executed ::')
}
