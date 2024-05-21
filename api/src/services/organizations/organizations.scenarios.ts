import type { Prisma, Organization } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: { data: { name: 'USDR1' } },
    two: { data: { name: 'USDR2' } },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>
