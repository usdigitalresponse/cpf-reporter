// File: api/src/services/reportingPeriodCertifications/reportingPeriodCertifications.scenarios.ts

import type { Prisma, ReportingPeriodCertification } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard =
  defineScenario<Prisma.ReportingPeriodCertificationCreateArgs>({
    reportingPeriodCertification: {
      one: {
        data: {
          organization: { create: { name: 'Org One' } },
          reportingPeriod: {
            create: {
              name: 'Period One',
              startDate: '2024-09-04T17:17:49.871Z',
              endDate: '2024-09-04T17:17:49.871Z',
              inputTemplate: {
                create: {
                  name: 'Input Template One',
                  version: '1.0',
                  effectiveDate: '2024-09-04T17:17:49.871Z',
                },
              },
              outputTemplate: {
                create: {
                  name: 'Output Template One',
                  version: '1.0',
                  effectiveDate: '2024-09-04T17:17:49.871Z',
                },
              },
            },
          },
          certifiedBy: {
            create: {
              email: 'user1@example.com',
              name: 'User One',
              role: 'USDR_ADMIN',
              agency: { create: { name: 'Agency One', code: 'A1' } },
            },
          },
        },
      },
      two: {
        data: {
          organization: { create: { name: 'Org Two' } },
          reportingPeriod: {
            create: {
              name: 'Period Two',
              startDate: '2024-09-04T17:17:49.871Z',
              endDate: '2024-09-04T17:17:49.871Z',
              inputTemplate: {
                create: {
                  name: 'Input Template Two',
                  version: '1.0',
                  effectiveDate: '2024-09-04T17:17:49.871Z',
                },
              },
              outputTemplate: {
                create: {
                  name: 'Output Template Two',
                  version: '1.0',
                  effectiveDate: '2024-09-04T17:17:49.871Z',
                },
              },
            },
          },
          certifiedBy: {
            create: {
              email: 'user2@example.com',
              name: 'User Two',
              role: 'USDR_ADMIN',
              agency: { create: { name: 'Agency Two', code: 'A2' } },
            },
          },
        },
      },
    },
  })

export type StandardScenario = ScenarioData<
  ReportingPeriodCertification,
  'reportingPeriodCertification'
>
