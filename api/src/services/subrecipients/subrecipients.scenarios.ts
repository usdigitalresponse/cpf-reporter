import type {
  Prisma,
  User,
  Organization,
  Agency,
  ReportingPeriod,
  Subrecipient,
  SubrecipientUpload,
} from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  | Prisma.OrganizationCreateArgs
  | Prisma.AgencyCreateArgs
  | Prisma.UserCreateArgs
  | Prisma.ReportingPeriodCreateArgs
  | Prisma.SubrecipientCreateArgs
  | Prisma.SubrecipientUploadCreateArgs
>({
  organization: {
    one: {
      data: {
        name: 'USDR',
        preferences: {},
      },
    },
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'Agency1',
        organizationId: scenario.organization.one.id,
        code: 'A1',
      },
      include: {
        organization: true,
      },
    }),
  },
  user: {
    one: (scenario) => ({
      data: {
        email: 'uniqueemail1@test.com',
        name: 'String',
        role: 'USDR_ADMIN',
        agencyId: scenario.agency.one.id,
      },
      include: {
        agency: true,
      },
    }),
  },
  reportingPeriod: {
    one: () => ({
      data: {
        name: 'String',
        startDate: '2024-01-26T15:11:27.688Z',
        endDate: '2024-01-26T15:11:27.688Z',
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
    }),
  },
  subrecipient: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organization: { connect: { id: scenario.organization.one.id } },
        ueiTinCombo: '10934_985867',
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String',
        organization: { connect: { id: scenario.organization.one.id } },
        ueiTinCombo: '12485_920485',
      },
    }),
  },
  subrecipientUpload: {
    one: (scenario) => ({
      data: {
        rawSubrecipient: { test: 'test' },
        version: 'V2023_12_12',
        subrecipient: { connect: { id: scenario.subrecipient.one.id } },
        upload: {
          create: {
            filename: 'latest_validation_invalid',
            uploadedBy: { connect: { id: scenario.user.one.id } },
            agency: {
              connect: {
                id: scenario.agency.one.id,
              },
            },
            reportingPeriod: {
              connect: { id: scenario.reportingPeriod.one.id },
            },
            validations: {
              create: [
                {
                  passed: true,
                  results: '{}',
                  createdAt: '2024-01-26T15:11:27.000Z',
                  initiatedById: scenario.user.one.id,
                },
                {
                  passed: false,
                  results: '{errors: { severity: err }}',
                  createdAt: '2024-01-27T10:32:00.000Z',
                  initiatedById: scenario.user.one.id,
                },
              ],
            },
          },
        },
      },
    }),
    two: (scenario) => ({
      data: {
        rawSubrecipient: { test: 'test' },
        version: 'V2023_12_12',
        subrecipient: { connect: { id: scenario.subrecipient.one.id } },
        upload: {
          create: {
            filename: 'latest_validation_valid',
            uploadedBy: { connect: { id: scenario.user.one.id } },
            agency: {
              connect: {
                id: scenario.agency.one.id,
              },
            },
            reportingPeriod: {
              connect: { id: scenario.reportingPeriod.one.id },
            },
            validations: {
              create: [
                {
                  passed: false,
                  results: '{errors: { severity: err }}',
                  createdAt: '2024-01-25T10:32:00.000Z',
                  initiatedById: scenario.user.one.id,
                },
                {
                  passed: true,
                  results: '{}',
                  createdAt: '2024-01-28T15:11:27.000Z',
                  initiatedById: scenario.user.one.id,
                },
              ],
            },
          },
        },
      },
    }),
  },
})

export type StandardScenario = ScenarioData<User, 'user'> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'> &
  ScenarioData<ReportingPeriod, 'reportingPeriod'> &
  ScenarioData<Subrecipient, 'subrecipient'> &
  ScenarioData<SubrecipientUpload, 'subrecipientUpload'>
