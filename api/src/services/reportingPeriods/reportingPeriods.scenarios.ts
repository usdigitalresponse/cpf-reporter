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
        startDate: '2024-01-12T15:48:11.499Z',
        endDate: '2024-01-12T15:48:11.499Z',
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
})

export type StandardScenario = ScenarioData<ReportingPeriod, 'reportingPeriod'>
