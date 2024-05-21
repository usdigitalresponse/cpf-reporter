import type { Prisma, Organization } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs | Prisma.ReportingPeriodCreateArgs>({
  reportingPeriod: {
    one: {
      data: {
        name: 'Reporting Period 1',
        startDate: '2024-01-12T15:48:11.499Z',
        endDate: '2024-01-12T15:48:11.499Z',
        organization: { create: { name: 'String' } },
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
      },
    },
  },
  organization: {
    one: (scenario) => ({ data: { name: 'USDR1', preferences: { current_reporting_period_id: scenario.reportingPeriod.one.id } } }),
    two: (scenario) => ({ data: { name: 'USDR2', preferences: { current_reporting_period_id: scenario.reportingPeriod.one.id } } }),
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>
