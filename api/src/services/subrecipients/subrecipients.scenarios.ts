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
    q3: () => ({
      data: {
        name: 'Q3 2024 [July 1 - September 30]',
        startDate: '2024-07-01T00:00:00.000Z',
        endDate: '2024-09-30T00:00:00.000Z',
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
  organization: {
    one: {
      data: {
        name: 'USDR',
        preferences: {},
      },
    },
    two: (scenario) => ({
      data: {
        name: 'Q3 Testing Org',
        preferences: {
          current_reporting_period_id: scenario.reportingPeriod.q3.id,
        },
      },
    }),
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
    two: (scenario) => ({
      data: {
        name: 'Q3Agency',
        organizationId: scenario.organization.two.id,
        code: 'AQ3',
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
    two: (scenario) => ({
      data: {
        email: 'q3@test.com',
        name: 'Q3 User',
        role: 'USDR_ADMIN',
        agencyId: scenario.agency.two.id,
      },
      include: {
        agency: true,
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
    q3_createdOctober: (scenario) => ({
      data: {
        name: 'October Subrecipient',
        organization: { connect: { id: scenario.organization.two.id } },
        ueiTinCombo: '17290_172900',
        createdAt: '2024-10-15T00:00:00.000Z',
      },
    }),
    q3_createdNovember: (scenario) => ({
      data: {
        name: 'November Subrecipient',
        organization: { connect: { id: scenario.organization.two.id } },
        ueiTinCombo: '17291_172911',
        createdAt: '2024-11-26T00:00:00.000Z',
      },
    }),
    q3_createdSeptember: (scenario) => ({
      data: {
        name: 'September Subrecipient',
        organization: { connect: { id: scenario.organization.two.id } },
        ueiTinCombo: '17292_172922',
        createdAt: '2024-09-26T00:00:00.000Z',
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
