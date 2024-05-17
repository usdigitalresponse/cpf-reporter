import type {
  Prisma,
  Upload,
  User,
  Organization,
  Agency,
  ReportingPeriod,
} from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  | Prisma.OrganizationCreateArgs
  | Prisma.AgencyCreateArgs
  | Prisma.UserCreateArgs
  | Prisma.ReportingPeriodCreateArgs
  | Prisma.UploadCreateArgs
>({
  organization: {
    one: {
      data: {
        name: 'USDR',
      },
    },
    two: {
      data: {
        name: 'Example Organization',
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
    two: (scenario) => ({
      data: {
        name: 'Agency2',
        organizationId: scenario.organization.two.id,
        code: 'A2',
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
        role: 'ORGANIZATION_ADMIN',
        agencyId: scenario.agency.one.id,
      },
      include: {
        agency: true,
      },
    }),
    two: (scenario) => ({
      data: {
        email: 'uniqueemail25@test.com',
        name: 'String',
        role: 'USDR_ADMIN',
        agencyId: scenario.agency.one.id,
      },
      include: {
        agency: true,
      },
    }),
    three: (scenario) => ({
      data: {
        email: 'uniqueemail3@test.com',
        name: 'String',
        role: 'ORGANIZATION_STAFF',
        agencyId: scenario.agency.two.id,
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
  upload: {
    one: (scenario) => ({
      data: {
        filename: 'String',
        uploadedById: scenario.user.one.id,
        agencyId: scenario.agency.one.id,
        reportingPeriodId: scenario.reportingPeriod.one.id,
        validations: {
          create: [
            {
              passed: true,
              results: '{error:false}',
              createdAt: '2024-01-26T15:11:27.000Z',
              initiatedById: scenario.user.one.id,
            },
            {
              passed: true,
              results: '{error:false}',
              createdAt: '2024-01-27T10:32:00.000Z',
              initiatedById: scenario.user.one.id,
            },
          ],
        },
        createdAt: '2024-01-20T15:11:27.000Z',
        updatedAt: '2024-01-20T15:11:27.000Z',
      },
    }),
    two: (scenario) => ({
      data: {
        filename: 'String',
        uploadedById: scenario.user.two.id,
        agencyId: scenario.agency.one.id,
        reportingPeriodId: scenario.reportingPeriod.one.id,
        validations: {
          create: [
            {
              passed: true,
              results: '{error:false}',
              initiatedById: scenario.user.two.id,
              createdAt: '2024-01-29T18:13:25.000Z',
            },
            {
              passed: true,
              results: '{error:false}',
              initiatedById: scenario.user.two.id,
              createdAt: '2024-01-29T17:10:22.000Z',
            },
          ],
        },
        createdAt: '2024-01-21T18:10:17.000Z',
        updatedAt: '2024-01-21T18:10:17.000Z',
      },
    }),
    three: (scenario) => ({
      data: {
        filename: 'String',
        uploadedById: scenario.user.three.id,
        agencyId: scenario.agency.two.id,
        reportingPeriodId: scenario.reportingPeriod.one.id,
        validations: {},
        createdAt: '2024-01-21T18:10:17.000Z',
        updatedAt: '2024-01-21T18:10:17.000Z',
      },
    }),
  },
})

export type StandardScenario = ScenarioData<Upload, 'upload'> &
  ScenarioData<User, 'user'> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'> &
  ScenarioData<ReportingPeriod, 'reportingPeriod'>
