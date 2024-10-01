import type { Prisma, UploadValidation, Upload } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  Prisma.UploadValidationCreateArgs | Prisma.UploadCreateArgs
>({
  uploadValidation: {
    one: {
      data: {
        updatedAt: '2023-12-08T21:03:20.706Z',
        passed: false,
        results: null,
        upload: {
          create: {
            filename: 'abc123',
            updatedAt: '2023-12-08T21:03:20.706Z',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'String1',
                role: 'USDR_ADMIN',
                updatedAt: '2023-12-08T21:03:20.706Z',
                agency: { create: { name: 'ABC123-1', code: 'ABC123-1' } },
              },
            },
            agency: { create: { name: 'ABC123-1', code: 'ABC123-1' } },
            reportingPeriod: {
              create: {
                name: 'rep-period-1',
                startDate: '2023-12-08T21:03:20.706Z',
                endDate: '2023-12-08T21:03:20.706Z',
                updatedAt: '2023-12-08T21:03:20.706Z',
                inputTemplate: {
                  create: {
                    name: 'input-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'output-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
              },
            },
            expenditureCategory: {
              create: {
                name: 'ABC123',
                code: 'ABC123',
                updatedAt: '2023-12-08T21:03:20.706Z',
              },
            },
          },
        },
        initiatedBy: {
          create: {
            name: 'USDR_ADMIN',
            email: 'usdr_admin@usdigitalresponse.org',
            role: 'USDR_ADMIN',
            updatedAt: '2023-12-08T21:03:20.706Z',
            agency: {
              create: {
                name: 'ABC123-1',
                code: 'ABC123-1',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  UploadValidation,
  'uploadValidation'
> &
  ScenarioData<Upload, 'upload'>
