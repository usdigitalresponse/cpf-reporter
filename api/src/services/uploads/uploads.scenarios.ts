import type { Prisma, Upload } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadCreateArgs>({
  upload: {
    one: {
      data: {
        filename: 'String',
        updatedAt: '2023-12-08T21:03:09.638Z',
        uploadedBy: {
          create: {
            email: 'String',
            updatedAt: '2023-12-08T21:03:09.638Z',
            organization: { create: { name: 'String' } },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-08T21:03:09.638Z',
            endDate: '2023-12-08T21:03:09.638Z',
            updatedAt: '2023-12-08T21:03:09.638Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-08T21:03:09.638Z',
                updatedAt: '2023-12-08T21:03:09.638Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-08T21:03:09.638Z',
                updatedAt: '2023-12-08T21:03:09.638Z',
              },
            },
          },
        },
        expenditureCategory: {
          create: {
            name: 'String',
            code: 'String',
            updatedAt: '2023-12-08T21:03:09.638Z',
          },
        },
      },
    },
    two: {
      data: {
        filename: 'String',
        updatedAt: '2023-12-08T21:03:09.638Z',
        uploadedBy: {
          create: {
            email: 'String',
            updatedAt: '2023-12-08T21:03:09.638Z',
            organization: { create: { name: 'String' } },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-08T21:03:09.638Z',
            endDate: '2023-12-08T21:03:09.638Z',
            updatedAt: '2023-12-08T21:03:09.638Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-08T21:03:09.638Z',
                updatedAt: '2023-12-08T21:03:09.638Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-08T21:03:09.639Z',
                updatedAt: '2023-12-08T21:03:09.639Z',
              },
            },
          },
        },
        expenditureCategory: {
          create: {
            name: 'String',
            code: 'String',
            updatedAt: '2023-12-08T21:03:09.639Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Upload, 'upload'>
