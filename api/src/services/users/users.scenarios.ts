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
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organizationId: scenario.organization.one.id,
        code: 'String',
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
  },
})

export type StandardScenario = ScenarioData<User, 'user'> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'>
