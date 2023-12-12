import type { ExpenditureCategory } from '@prisma/client'

import {
  expenditureCategories,
  expenditureCategory,
  createExpenditureCategory,
  updateExpenditureCategory,
  deleteExpenditureCategory,
} from './expenditureCategories'
import type { StandardScenario } from './expenditureCategories.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('expenditureCategories', () => {
  scenario(
    'returns all expenditureCategories',
    async (scenario: StandardScenario) => {
      const result = await expenditureCategories()

      expect(result.length).toEqual(
        Object.keys(scenario.expenditureCategory).length
      )
    }
  )

  scenario(
    'returns a single expenditureCategory',
    async (scenario: StandardScenario) => {
      const result = await expenditureCategory({
        id: scenario.expenditureCategory.one.id,
      })

      expect(result).toEqual(scenario.expenditureCategory.one)
    }
  )

  scenario('creates a expenditureCategory', async () => {
    const result = await createExpenditureCategory({
      input: {
        name: 'String',
        code: 'String',
        updatedAt: '2023-12-08T21:02:51.214Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.code).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2023-12-08T21:02:51.214Z'))
  })

  scenario(
    'updates a expenditureCategory',
    async (scenario: StandardScenario) => {
      const original = (await expenditureCategory({
        id: scenario.expenditureCategory.one.id,
      })) as ExpenditureCategory
      const result = await updateExpenditureCategory({
        id: original.id,
        input: { name: 'String2' },
      })

      expect(result.name).toEqual('String2')
    }
  )

  scenario(
    'deletes a expenditureCategory',
    async (scenario: StandardScenario) => {
      const original = (await deleteExpenditureCategory({
        id: scenario.expenditureCategory.one.id,
      })) as ExpenditureCategory
      const result = await expenditureCategory({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
