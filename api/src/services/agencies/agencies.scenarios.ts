import type { Prisma, agency } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.agencyCreateArgs>({
  agency: {
    one: { data: { name: 'String', code: 'String' } },
    two: { data: { name: 'String', code: 'String' } },
  },
})

export type StandardScenario = ScenarioData<agency, 'agency'>
