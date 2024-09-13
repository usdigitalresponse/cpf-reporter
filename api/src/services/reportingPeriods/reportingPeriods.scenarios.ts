import type { Prisma, ReportingPeriod } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReportingPeriodCreateArgs>({
  reportingPeriod: {
    one: {
      data: {
        name: 'String',
        startDate: '2024-01-12T15:48:11.499Z',
        endDate: '2024-01-12T15:48:11.499Z',
        inputTemplate: {
          create: {
            name: 'INPUT TEMPLATE ONE',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'OUTPUT TEMPLATE ONE',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2024-01-14T15:48:11.499Z',
        endDate: '2024-01-14T15:48:11.499Z',
        inputTemplate: {
          create: {
            name: 'INPUT TEMPLATE TWO',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'OUTPUT TEMPLATE TWO',
            version: 'String',
            effectiveDate: '2024-01-12T15:48:11.499Z',
          },
        },
      },
    },
  },
  organization: {
    one: (scenario) => ({
      data: {
        name: 'USDR1',
        preferences: {
          current_reporting_period_id: scenario.reportingPeriod.one.id,
        },
      },
    }),
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'String',
        code: 'String',
        organization: {
          connect: {
            id: scenario.organization.one.id,
          },
        },
      },
    }),
  },
  user: {
    one: (scenario) => ({
      data: {
        email: 'orgadmin@example.com',
        name: 'Org Admin',
        role: 'ORGANIZATION_ADMIN',
        agency: { connect: { id: scenario.agency.one.id } },
      },
      include: {
        agency: true,
      },
    }),
  },
})

export type StandardScenario = ScenarioData<ReportingPeriod, 'reportingPeriod'>
