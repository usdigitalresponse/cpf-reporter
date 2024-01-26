import type { Prisma, Upload } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadCreateArgs>({
  upload: {
    one: {
      data: {
        filename: 'String',
        uploadedBy: { create: { email: 'String' } },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2024-01-26T15:11:27.688Z',
            endDate: '2024-01-26T15:11:27.688Z',
            organization: { create: { name: 'String' } },
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2024-01-26T15:11:27.688Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2024-01-26T15:11:27.688Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        filename: 'String',
        uploadedBy: { create: { email: 'String' } },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2024-01-26T15:11:27.688Z',
            endDate: '2024-01-26T15:11:27.688Z',
            organization: { create: { name: 'String' } },
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2024-01-26T15:11:27.688Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2024-01-26T15:11:27.688Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Upload, 'upload'>
