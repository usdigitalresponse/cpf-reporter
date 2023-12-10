import type { Prisma, Upload } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadCreateArgs>({
  upload: {
    one: {
      data: {
        filename: 'String',
        updatedAt: '2023-12-10T04:48:04.896Z',
        uploadedBy: {
          create: {
            email: 'String',
            updatedAt: '2023-12-10T04:48:04.896Z',
            organization: { create: { name: 'String' } },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organizaiton: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-10T04:48:04.896Z',
            endDate: '2023-12-10T04:48:04.896Z',
            updatedAt: '2023-12-10T04:48:04.896Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-10T04:48:04.896Z',
                updatedAt: '2023-12-10T04:48:04.896Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-10T04:48:04.896Z',
                updatedAt: '2023-12-10T04:48:04.896Z',
              },
            },
          },
        },
        expenditureCategory: {
          create: {
            name: 'String',
            code: 'String',
            updatedAt: '2023-12-10T04:48:04.896Z',
          },
        },
      },
    },
    two: {
      data: {
        filename: 'String',
        updatedAt: '2023-12-10T04:48:04.896Z',
        uploadedBy: {
          create: {
            email: 'String',
            updatedAt: '2023-12-10T04:48:04.896Z',
            organization: { create: { name: 'String' } },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organizaiton: { create: { name: 'String' } },
        reportingPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-10T04:48:04.896Z',
            endDate: '2023-12-10T04:48:04.896Z',
            updatedAt: '2023-12-10T04:48:04.896Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-10T04:48:04.896Z',
                updatedAt: '2023-12-10T04:48:04.896Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-10T04:48:04.896Z',
                updatedAt: '2023-12-10T04:48:04.896Z',
              },
            },
          },
        },
        expenditureCategory: {
          create: {
            name: 'String',
            code: 'String',
            updatedAt: '2023-12-10T04:48:04.896Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Upload, 'upload'>
