import type { Prisma, UploadValidation } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadValidationCreateArgs>({
  uploadValidation: {
    one: {
      data: {
        updatedAt: '2023-12-08T21:03:20.706Z',
        upload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-08T21:03:20.706Z',
            uploadedBy: {
              create: {
                email: 'String',
                updatedAt: '2023-12-08T21:03:20.706Z',
                organization: { create: { name: 'String' } },
              },
            },
            agency: { create: { name: 'String', code: 'String' } },
            organization: { create: { name: 'String' } },
            reportingPeriod: {
              create: {
                name: 'String',
                startDate: '2023-12-08T21:03:20.706Z',
                endDate: '2023-12-08T21:03:20.706Z',
                updatedAt: '2023-12-08T21:03:20.706Z',
                inputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
              },
            },
            expenditureCategory: {
              create: {
                name: 'String',
                code: 'String',
                updatedAt: '2023-12-08T21:03:20.706Z',
              },
            },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-08T21:03:20.706Z',
            updatedAt: '2023-12-08T21:03:20.706Z',
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2023-12-08T21:03:20.706Z',
        upload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-08T21:03:20.706Z',
            uploadedBy: {
              create: {
                email: 'String',
                updatedAt: '2023-12-08T21:03:20.706Z',
                organization: { create: { name: 'String' } },
              },
            },
            agency: { create: { name: 'String', code: 'String' } },
            organization: { create: { name: 'String' } },
            reportingPeriod: {
              create: {
                name: 'String',
                startDate: '2023-12-08T21:03:20.706Z',
                endDate: '2023-12-08T21:03:20.706Z',
                updatedAt: '2023-12-08T21:03:20.706Z',
                inputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'String',
                    version: 'String',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
              },
            },
            expenditureCategory: {
              create: {
                name: 'String',
                code: 'String',
                updatedAt: '2023-12-08T21:03:20.706Z',
              },
            },
          },
        },
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        inputTemplate: {
          create: {
            name: 'String',
            version: 'String',
            effectiveDate: '2023-12-08T21:03:20.706Z',
            updatedAt: '2023-12-08T21:03:20.706Z',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  UploadValidation,
  'uploadValidation'
>
