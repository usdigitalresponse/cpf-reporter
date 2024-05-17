import type { Prisma, ValidationRules } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ValidationRulesCreateArgs>({
  validationRules: {
    one: { data: { versionId: 'V2023_12_12' } },
    two: { data: { versionId: 'V2023_12_12' } },
  },
})

export type StandardScenario = ScenarioData<ValidationRules, 'validationRules'>
