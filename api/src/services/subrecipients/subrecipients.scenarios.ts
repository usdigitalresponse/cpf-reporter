import type { Prisma, Subrecipient } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubrecipientCreateArgs>({
  subrecipient: {
    one: {
      data: {
        name: 'String',
        startDate: '2023-12-09T14:50:18.317Z',
        endDate: '2023-12-09T14:50:18.317Z',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        originationUpload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-09T14:50:18.317Z',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'uniqueemail1@test.com',
                updatedAt: '2023-12-09T14:50:18.317Z',
                agency: { create: { name: 'String', code: 'String' } },
                role: 'USDR_ADMIN',
              },
            },
            agency: { create: { name: 'String', code: 'String' } },
            organization: { create: { name: 'String' } },
            reportingPeriod: {
              create: {
                name: 'String',
                startDate: '2023-12-09T14:50:18.317Z',
                endDate: '2023-12-09T14:50:18.317Z',
                updatedAt: '2023-12-09T14:50:18.317Z',
                inputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-09T14:50:18.317Z',
                    updatedAt: '2023-12-09T14:50:18.317Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-09T14:50:18.317Z',
                    updatedAt: '2023-12-09T14:50:18.317Z',
                  },
                },
                organization: { create: { name: 'String' } },
              },
            },
            expenditureCategory: {
              create: {
                name: 'String',
                code: 'String',
                updatedAt: '2023-12-09T14:50:18.317Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2023-12-09T14:50:18.317Z',
        endDate: '2023-12-09T14:50:18.317Z',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        originationUpload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-09T14:50:18.317Z',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'uniqueemail2@test.com',
                updatedAt: '2023-12-09T14:50:18.317Z',
                agency: { create: { name: 'String', code: 'String' } },
                role: 'USDR_ADMIN',
              },
            },
            agency: { create: { name: 'String', code: 'String' } },
            organization: { create: { name: 'String' } },
            reportingPeriod: {
              create: {
                name: 'String',
                startDate: '2023-12-09T14:50:18.317Z',
                endDate: '2023-12-09T14:50:18.317Z',
                updatedAt: '2023-12-09T14:50:18.317Z',
                inputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-09T14:50:18.317Z',
                    updatedAt: '2023-12-09T14:50:18.317Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-09T14:50:18.317Z',
                    updatedAt: '2023-12-09T14:50:18.317Z',
                  },
                },
                organization: {
                  create: { name: 'String' },
                },
              },
            },
            expenditureCategory: {
              create: {
                name: 'String',
                code: 'String',
                updatedAt: '2023-12-09T14:50:18.317Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subrecipient, 'subrecipient'>
