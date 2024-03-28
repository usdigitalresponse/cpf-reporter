import type { Prisma, User, Organization, Agency } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  | Prisma.OrganizationCreateArgs
  | Prisma.AgencyCreateArgs
  | Prisma.UserCreateArgs
>({
  organization: {
    one: {
      data: {
        name: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
      },
    },
    three: {
      data: {
        name: 'String',
      },
    },
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organization: {
          connect: {
            id: scenario.organization.one.id,
          },
        },
        code: 'String',
      },
      include: {
        organization: true,
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String',
        organization: {
          connect: { id: scenario.organization.one.id },
        },
        code: 'String',
      },
      include: {
        organization: true,
      },
    }),
    three: (scenario) => ({
      data: {
        name: 'String',
        code: 'String',
        organization: {
          connect: {
            id: scenario.organization.two.id,
          },
        },
      },
      include: {
        organization: true,
      },
    }),
    four: (scenario) => ({
      data: {
        name: 'String',
        code: 'String',
        organization: {
          connect: {
            id: scenario.organization.three.id,
          },
        },
      },
      include: {
        organization: true,
      },
    }),
  },
  user: {
    one: {
      data: {
        email: 'uniqueemail1@test.com',
        name: 'String',
        role: 'ORGANIZATION_ADMIN',
        agency: { create: { name: 'String', code: 'String' } },
      },
    },
    two: (scenario) => ({
      data: {
        email: 'uniqueemail25@test.com',
        name: 'String',
        role: 'ORGANIZATION_STAFF',
        agency: { connect: { id: scenario.agency.one.id } },
      },
      include: {
        agency: true,
      },
    }),
    three: (scenario) => ({
      data: {
        email: 'uniqueemail350@test.com',
        name: 'String',
        role: 'ORGANIZATION_STAFF',
        agency: { connect: { id: scenario.agency.one.id } },
      },
      include: {
        agency: true,
      },
    }),
    four: (scenario) => ({
      data: {
        email: 'uniqueemail450@test.com',
        name: 'String',
        role: 'ORGANIZATION_STAFF',
        agency: { connect: { id: scenario.agency.three.id } },
      },
      include: {
        agency: true,
      },
    }),
  },
})

export type StandardScenario = ScenarioData<User, 'user'> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'>
