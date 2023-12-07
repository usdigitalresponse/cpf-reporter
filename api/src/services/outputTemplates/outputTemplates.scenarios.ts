import type { Prisma, OutputTemplate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OutputTemplateCreateArgs>({
  outputTemplate: {
    one: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:34.973Z',
        rulesGeneratedAt: '2023-12-07T18:17:34.973Z',
        updatedAt: '2023-12-07T18:17:34.973Z',
      },
    },
    two: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:34.973Z',
        rulesGeneratedAt: '2023-12-07T18:17:34.973Z',
        updatedAt: '2023-12-07T18:17:34.973Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<OutputTemplate, 'outputTemplate'>
