// To access your database
// Append api/* to import from api and web/* to import from web
import { getPrismaClient } from 'api/src/lib/db'
import {
  getOrCreateOrganization
} from 'api/src/services/organizations/organizations'
import {
  getOrCreateAgencies
} from 'api/src/services/agencies/agencies'
import { getOrCreateUsers } from 'api/src/services/users/users'
import { getOrCreateReportingPeriod } from 'api/src/services/reportingPeriods/reportingPeriods'
import { getOrCreateInputTemplate } from 'api/src/services/inputTemplates/inputTemplates'
import { getOrCreateOutputTemplate } from 'api/src/services/outputTemplates/outputTemplates'
import { createOrSkipInitialExpenditureCategories } from 'api/src/services/expenditureCategories/expenditureCategories'

export default async ({ args }) => {
  /*
  Useful to create a new organization, agencies, and users.

  Example:
    yarn redwood exec onboardOrganization \
      --orgName 'Sample Org' \
      --initializeExpenditureCategories true \
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
        "outputTemplateName": "Output Template 1"
      }' \
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
  console.log(`Received following arguments: ${Object.keys(args)}`)

  if (!args.orgName) {
    throw new Error('Organization name is required')
  }

  if (args.initializeExpenditureCategories) {
    console.log('Initializing expenditure categories')
    await createOrSkipInitialExpenditureCategories()
  }

  if (args.inputTemplateInfo) {
    console.log('get or create input template')
    console.log(JSON.parse(args.inputTemplateInfo))
    const parsedInputTemplateInfo = JSON.parse(args.inputTemplateInfo)
    await getOrCreateInputTemplate(parsedInputTemplateInfo)
  }

  if (args.outputTemplateInfo) {
    console.log('get or create output template')
    console.log(JSON.parse(args.outputTemplateInfo))
    const parsedOutputTemplateInfo = JSON.parse(args.outputTemplateInfo)
    await getOrCreateOutputTemplate(parsedOutputTemplateInfo)
  }

  if (args.periodInfo) {
    console.log('get or create reporting period')
    console.log(JSON.parse(args.periodInfo))
    const parsedPeriodInfo = JSON.parse(args.periodInfo)
    await getOrCreateReportingPeriod(parsedPeriodInfo)
  }

  if (args.orgName && args.currentPeriodName) {
    console.log('Get or create Organization')
    console.log(args.orgName)
    console.log(args.currentPeriodName)
    await getOrCreateOrganization(args.orgName, args.currentPeriodName)
  }

  if (args.agencyInfo) {
    console.log('Get or create Agencies')
    console.log(JSON.parse(args.agencyInfo))
    const parsedAgencyInfo = JSON.parse(args.agencyInfo)
    await getOrCreateAgencies(args.orgName, parsedAgencyInfo)
  }

  if (args.userInfo) {
    console.log('Get or create Users')
    console.log(JSON.parse(args.userInfo))
    const parsedUserInfo = JSON.parse(args.userInfo)
    await getOrCreateUsers(parsedUserInfo, args.orgName)
  }
  console.log(':: Script executed ::')
}
