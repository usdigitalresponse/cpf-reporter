import type { Prisma, InputTemplate } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.InputTemplateCreateArgs>({
  inputTemplate: {
    one: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:24.389Z',
        rulesGeneratedAt: '2023-12-07T18:17:24.389Z',
        updatedAt: '2023-12-07T18:17:24.389Z',
      },
    },
    two: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:24.389Z',
        rulesGeneratedAt: '2023-12-07T18:17:24.389Z',
        updatedAt: '2023-12-07T18:17:24.389Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<InputTemplate, 'inputTemplate'>
