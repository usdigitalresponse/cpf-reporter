import type { Prisma, InputTemplate } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.InputTemplateCreateArgs>({
  inputTemplate: {
    one: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-05T14:45:25.773Z',
        rulesGeneratedAt: '2023-12-05T14:45:25.773Z',
        updatedAt: '2023-12-05T14:45:25.773Z',
      },
    },
    two: {
      data: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-05T14:45:25.773Z',
        rulesGeneratedAt: '2023-12-05T14:45:25.773Z',
        updatedAt: '2023-12-05T14:45:25.773Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<InputTemplate, 'inputTemplate'>
