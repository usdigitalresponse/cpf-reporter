import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'String',
        updatedAt: '2023-12-10T00:37:26.049Z',
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        email: 'String',
        updatedAt: '2023-12-10T00:37:26.049Z',
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
