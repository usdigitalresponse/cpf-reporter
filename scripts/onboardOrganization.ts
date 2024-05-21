// To access your database
// Append api/* to import from api and web/* to import from web
import { getPrismaClient } from 'api/src/lib/db'
import type { Prisma } from '@prisma/client'
import {
  getOrCreateOrganization
} from 'api/src/services/organizations/organizations'
import {
  getOrCreateAgencies
} from 'api/src/services/agencies/agencies'
import { getOrCreateUsers } from 'api/src/services/users/users'
import { getOrCreateReportingPeriod } from 'api/src/services/reportingPeriods/reportingPeriods'

async function addOrgAgencyUsers(currentPeriodName, orgName, agencyInfo, userInfo) {
  const reportingPeriod = await getOrCreateReportingPeriod(currentPeriodName)
  const organizationRecord = await getOrCreateOrganization(orgName, currentPeriodName)
  await getOrCreateAgencies(orgName, agencyInfo)
  getOrCreateUsers(userInfo, orgName)
}

export default async ({ args }) => {
  /*
  Useful to create a new organization, agencies, and users.

  Example:
    yarn redwood exec onboardOrganization \
      --inputTemplateInfo '{
        "name": "Input Template 1",
        "version": "1.0.0",
        "effectiveDate": "2024-04-01T00:00:00.000Z"
      }' \
      --outputTemplateInfo '{
        "name": "Output Template 1",
        "version": "1.0.0",
        "effectiveDate": "2024-04-01T00:00:00.000Z"
      }' \
      --currentPeriodName '[April 1st - June 30th] Q2 2024' \
      --periodInfo '{
        "name": "[April 1st - June 30th] Q2 2024",
        "startDate": "2024-04-01T00:00:00.000Z",
        "endDate": "2024-06-30T23:59:59.999Z",
        "inputTemplateName": "Input Template 1",
        "outputTemplateName": "Output Template 1",
      }' \
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
  console.log(JSON.parse(args.inputTemplateInfo))
  console.log(JSON.parse(args.outputTemplateInfo))
  console.log(args.currentPeriodName)
  console.log(args.orgName)
  console.log(JSON.parse(args.agencyInfo))
  console.log(JSON.parse(args.userInfo))
  await addOrgAgencyUsers(args.currentPeriodName, args.orgName, JSON.parse(args.agencyInfo), JSON.parse(args.userInfo))
  console.log(':: Script executed ::')
}
