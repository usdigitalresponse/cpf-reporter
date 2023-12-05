import type { Prisma, OutputTemplate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OutputTemplateCreateArgs>({
  outputTemplate: {
    one: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-05T14:45:43.919Z',
        rulesGeneratedAt: '2023-12-05T14:45:43.919Z',
        updatedAt: '2023-12-05T14:45:43.919Z',
      },
    },
    two: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-05T14:45:43.919Z',
        rulesGeneratedAt: '2023-12-05T14:45:43.919Z',
        updatedAt: '2023-12-05T14:45:43.919Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<OutputTemplate, 'outputTemplate'>
