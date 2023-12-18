import type { Prisma, Role } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.RoleCreateArgs>({
  role: {
    one: { data: { name: 'String', updatedAt: '2023-12-07T18:20:00.186Z' } },
    two: { data: { name: 'String', updatedAt: '2023-12-07T18:20:00.186Z' } },
  },
})

export type StandardScenario = ScenarioData<Role, 'role'>
