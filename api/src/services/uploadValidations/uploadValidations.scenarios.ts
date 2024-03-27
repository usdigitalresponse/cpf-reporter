import type { Prisma, UploadValidation } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UploadValidationCreateArgs>({
  uploadValidation: {
    one: {
      data: {
        updatedAt: '2023-12-08T21:03:20.706Z',
        passed: true,
        upload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-08T21:03:20.706Z',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'String1',
                role: 'USDR_ADMIN',
                updatedAt: '2023-12-08T21:03:20.706Z',
                agency: { create: { name: 'String', code: 'String' } },
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
                organization: { create: { name: 'String' } },
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
        initiatedBy: {
          create: {
            name: 'String',
            email: 'String2',
            role: 'USDR_ADMIN',
            updatedAt: '2023-12-08T21:03:20.706Z',
            agency: { create: { name: 'String', code: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        updatedAt: '2023-12-08T21:03:20.706Z',
        passed: true,
        upload: {
          create: {
            filename: 'String',
            updatedAt: '2023-12-08T21:03:20.706Z',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'String3',
                role: 'USDR_ADMIN',
                updatedAt: '2023-12-08T21:03:20.706Z',
                agency: { create: { name: 'String', code: 'String' } },
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
                organization: { create: { name: 'String' } },
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
        initiatedBy: {
          create: {
            name: 'String',
            email: 'String4',
            role: 'USDR_ADMIN',
            updatedAt: '2023-12-08T21:03:20.706Z',
            agency: { create: { name: 'String', code: 'String' } },
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
