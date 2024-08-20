import type { Prisma, OutputTemplate } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OutputTemplateCreateArgs>({
  outputTemplate: {
    one: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2024-08-19T20:09:50.500Z',
      },
    },
    two: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2024-08-19T20:09:50.500Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<OutputTemplate, 'outputTemplate'>
