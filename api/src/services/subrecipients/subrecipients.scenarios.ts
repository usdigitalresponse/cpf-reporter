import type { Prisma, Subrecipient } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubrecipientCreateArgs>({
  subrecipient: {
    one: {
      data: {
        name: 'String',
        startDate: '2023-12-09T14:50:18.317Z',
        endDate: '2023-12-09T14:50:18.317Z',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
      },
    },
    two: {
      data: {
        name: 'String',
        startDate: '2023-12-09T14:50:18.317Z',
        endDate: '2023-12-09T14:50:18.317Z',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subrecipient, 'subrecipient'>
