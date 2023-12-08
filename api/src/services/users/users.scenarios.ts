import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String',
        updatedAt: '2023-12-07T18:20:20.679Z',
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        email: 'String',
        updatedAt: '2023-12-07T18:20:20.679Z',
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
