import type { Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  Prisma.OrganizationCreateArgs | Prisma.AgencyCreateArgs
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
})
export type StandardScenario = ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'>
