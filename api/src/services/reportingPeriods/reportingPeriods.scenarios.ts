import type { Prisma, ReportingPeriod } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ReportingPeriodCreateArgs>({
  reportingPeriod: {
    one: {
      data: {
        name: 'String',
        startDate: '2023-12-05T14:45:54.515Z',
        endDate: '2023-12-05T14:45:54.515Z',
        updatedAt: '2023-12-05T14:45:54.515Z',
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-05T14:45:54.515Z',
            rulesGeneratedAt: '2023-12-05T14:45:54.515Z',
            updatedAt: '2023-12-05T14:45:54.515Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-05T14:45:54.515Z',
            rulesGeneratedAt: '2023-12-05T14:45:54.515Z',
            updatedAt: '2023-12-05T14:45:54.515Z',
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2023-12-05T14:45:54.515Z',
        endDate: '2023-12-05T14:45:54.515Z',
        updatedAt: '2023-12-05T14:45:54.515Z',
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-05T14:45:54.515Z',
            rulesGeneratedAt: '2023-12-05T14:45:54.515Z',
            updatedAt: '2023-12-05T14:45:54.515Z',
          },
        },
        outputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-05T14:45:54.515Z',
            rulesGeneratedAt: '2023-12-05T14:45:54.515Z',
            updatedAt: '2023-12-05T14:45:54.515Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<ReportingPeriod, 'reportingPeriod'>
