import type { Prisma, Upload } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadCreateArgs>({
  upload: {
    one: {
      data: {
        filename: 'String',
        uploadedBy: {
          create: {
            email: 'uniqueemail1@test.com',
            name: 'String',
            role: 'USDR_ADMIN',
            agency: {
              create: {
                name: 'String',
                code: 'String',
                organization: { create: { name: 'USDR' } },
              },
            },
          },
        },
        agency: {
          create: {
            name: 'String',
            code: 'String',
            organization: { create: { name: 'USDR' } },
          },
        },
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
                effectiveDate: '2024-01-26T00:00:00.000Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2024-01-26T00:00:00.000Z',
              },
            },
          },
        },
        validations: {
          create: [
            {
              passed: true,
              results: '{error:false}',
              createdAt: '2024-01-26T15:11:27.000Z',
              initiatedBy: {
                create: {
                  email: 'uniqueemail2@test.com',
                  name: 'String',
                  role: 'USDR_ADMIN',
                  agency: { create: { name: 'String', code: 'String' } },
                },
              },
            },
            {
              passed: true,
              results: '{error:false}',
              createdAt: '2024-01-27T10:32:00.000Z',
              initiatedBy: {
                create: {
                  email: 'uniqueemail3@test.com',
                  name: 'String',
                  role: 'USDR_ADMIN',
                  agency: { create: { name: 'String', code: 'String' } },
                },
              },
            },
          ],
        },
        createdAt: '2024-01-20T15:11:27.000Z',
        updatedAt: '2024-01-20T15:11:27.000Z',
      },
    },
    two: {
      data: {
        filename: 'String',
        uploadedBy: {
          create: {
            email: 'uniqueemail4@test.com',
            name: 'String',
            role: 'USDR_ADMIN',
            agency: { create: { name: 'String', code: 'String' } },
          },
        },
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
        validations: {
          create: [
            {
              passed: true,
              results: '{error:false}',
              initiatedBy: {
                create: {
                  email: 'uniqueemail5@test.com',
                  name: 'String',
                  role: 'USDR_ADMIN',
                  agency: { create: { name: 'String', code: 'String' } },
                },
              },
              createdAt: '2024-01-29T18:13:25.000Z',
            },
            {
              passed: true,
              results: '{error:false}',
              initiatedBy: {
                create: {
                  email: 'uniqueemail6@test.com',
                  name: 'String',
                  role: 'USDR_ADMIN',
                  agency: { create: { name: 'String', code: 'String' } },
                },
              },
              createdAt: '2024-01-29T17:10:22.000Z',
            },
          ],
        },
        createdAt: '2024-01-21T18:10:17.000Z',
        updatedAt: '2024-01-21T18:10:17.000Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Upload, 'upload'>
