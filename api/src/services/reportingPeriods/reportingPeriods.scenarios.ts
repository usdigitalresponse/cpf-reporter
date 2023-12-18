import type { Prisma, ReportingPeriod } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReportingPeriodCreateArgs>({
  reportingPeriod: {
    one: {
      data: {
        name: 'String',
        startDate: '2023-12-07T18:38:12.356Z',
        endDate: '2023-12-07T18:38:12.356Z',
        updatedAt: '2023-12-07T18:38:12.356Z',
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-07T18:38:12.356Z',
            updatedAt: '2023-12-07T18:38:12.356Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-07T18:38:12.356Z',
            updatedAt: '2023-12-07T18:38:12.356Z',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2023-12-07T18:38:12.356Z',
        endDate: '2023-12-07T18:38:12.356Z',
        updatedAt: '2023-12-07T18:38:12.356Z',
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-07T18:38:12.356Z',
            updatedAt: '2023-12-07T18:38:12.356Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-07T18:38:12.356Z',
            updatedAt: '2023-12-07T18:38:12.356Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ReportingPeriod, 'reportingPeriod'>
