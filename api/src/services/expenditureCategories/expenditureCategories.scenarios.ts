import type { Prisma, ExpenditureCategory } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ExpenditureCategoryCreateArgs>({
  expenditureCategory: {
    one: {
      data: {
        name: 'String',
        code: 'String',
        updatedAt: '2023-12-08T21:02:51.236Z',
      },
    },
    two: {
      data: {
        name: 'String',
        code: 'String',
        updatedAt: '2023-12-08T21:02:51.236Z',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  ExpenditureCategory,
  'expenditureCategory'
>
