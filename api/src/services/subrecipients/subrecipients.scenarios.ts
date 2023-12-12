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
                email: 'String',
                updatedAt: '2023-12-09T14:50:18.317Z',
                organization: { create: { name: 'String' } },
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
                email: 'String',
                updatedAt: '2023-12-09T14:50:18.317Z',
                organization: { create: { name: 'String' } },
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
