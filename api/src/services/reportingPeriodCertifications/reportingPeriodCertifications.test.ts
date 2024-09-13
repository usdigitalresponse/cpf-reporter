import type { ReportingPeriodCertification } from '@prisma/client'

import { db } from 'src/lib/db'

import {
  reportingPeriodCertifications,
  reportingPeriodCertification,
  createReportingPeriodCertification,
  updateReportingPeriodCertification,
  deleteReportingPeriodCertification,
} from './reportingPeriodCertifications'
import type { StandardScenario } from './reportingPeriodCertifications.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('reportingPeriodCertifications', () => {
  scenario(
    'returns all reportingPeriodCertifications',
    async (scenario: StandardScenario) => {
      const result = await reportingPeriodCertifications()

      expect(result.length).toEqual(
        Object.keys(scenario.reportingPeriodCertification).length
      )
    }
  )

  scenario(
    'returns a single reportingPeriodCertification',
    async (scenario: StandardScenario) => {
      const result = await reportingPeriodCertification({
        id: scenario.reportingPeriodCertification.one.id,
      })

      expect(result).toEqual(scenario.reportingPeriodCertification.one)
    }
  )

  scenario(
    'creates a reportingPeriodCertification',
    async (scenario: StandardScenario) => {
      // Create a new organization and reporting period for this test
      const newOrg = await db.organization.create({ data: { name: 'New Org' } })
      const newReportingPeriod = await db.reportingPeriod.create({
        data: {
          name: 'New Period',
          startDate: new Date(),
          endDate: new Date(),
          inputTemplate: {
            create: {
              name: 'New Input Template',
              version: '1.0',
              effectiveDate: new Date(),
            },
          },
          outputTemplate: {
            create: {
              name: 'New Output Template',
              version: '1.0',
              effectiveDate: new Date(),
            },
          },
        },
      })

      const result = await createReportingPeriodCertification({
        input: {
          organizationId: newOrg.id,
          reportingPeriodId: newReportingPeriod.id,
          certifiedById:
            scenario.reportingPeriodCertification.one.certifiedById,
        },
      })

      expect(result.organizationId).toEqual(newOrg.id)
      expect(result.reportingPeriodId).toEqual(newReportingPeriod.id)
      expect(result.certifiedById).toEqual(
        scenario.reportingPeriodCertification.one.certifiedById
      )
    }
  )

  scenario(
    'updates a reportingPeriodCertification',
    async (scenario: StandardScenario) => {
      const original = (await reportingPeriodCertification({
        id: scenario.reportingPeriodCertification.one.id,
      })) as ReportingPeriodCertification
      const result = await updateReportingPeriodCertification({
        id: original.id,
        input: {
          organizationId:
            scenario.reportingPeriodCertification.two.organizationId,
        },
      })

      expect(result.organizationId).toEqual(
        scenario.reportingPeriodCertification.two.organizationId
      )
    }
  )

  scenario(
    'deletes a reportingPeriodCertification',
    async (scenario: StandardScenario) => {
      const original = (await deleteReportingPeriodCertification({
        id: scenario.reportingPeriodCertification.one.id,
      })) as ReportingPeriodCertification
      const result = await reportingPeriodCertification({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
