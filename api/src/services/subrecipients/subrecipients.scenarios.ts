import type { Prisma, Subrecipient } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubrecipientCreateArgs>({
  subrecipient: {
    one: {
      data: {
        name: 'String',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        ueiTinCombo: '12345802934',
      },
    },
    two: {
      data: {
        name: 'String',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        ueiTinCombo: '12485920485',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subrecipient, 'subrecipient'>
