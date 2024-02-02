import type { Prisma, User, Organization, Agency } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs | Prisma.AgencyCreateArgs | Prisma.UserCreateArgs>({
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
    })
  },
  user: {
    one: {
      data: {
        email: 'String',
        name: 'String',
        organization: { create: { name: 'String' } },
        agency: { create: { name: 'String', code: 'String' } },
        role: 'ORGANIZATION_ADMIN',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'> & ScenarioData<Organization, 'organization'> & ScenarioData<Agency, 'agency'>