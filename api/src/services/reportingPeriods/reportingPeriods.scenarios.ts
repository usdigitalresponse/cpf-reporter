import type { Prisma, ReportingPeriod } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReportingPeriodCreateArgs>({
  reportingPeriod: {
    one: {
      data: {
        name: 'String',
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
    two: {
      data: {
        name: 'String',
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
})

export type StandardScenario = ScenarioData<ReportingPeriod, 'reportingPeriod'>
