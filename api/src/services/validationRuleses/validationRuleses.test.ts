import type { ValidationRules } from '@prisma/client'

import {
  validationRuleses,
  validationRules,
  createValidationRules,
  updateValidationRules,
  deleteValidationRules,
} from './validationRuleses'
import type { StandardScenario } from './validationRuleses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('validationRuleses', () => {
  scenario(
    'returns all validationRuleses',
    async (scenario: StandardScenario) => {
      const result = await validationRuleses()

      expect(result.length).toEqual(
        Object.keys(scenario.validationRules).length
      )
    }
  )

  scenario(
    'returns a single validationRules',
    async (scenario: StandardScenario) => {
      const result = await validationRules({
        id: scenario.validationRules.one.id,
      })

      expect(result).toEqual(scenario.validationRules.one)
    }
  )

  scenario('creates a validationRules', async () => {
    const result = await createValidationRules({
      input: { versionId: 'V2023_12_12' },
    })

    expect(result.versionId).toEqual('V2023_12_12')
  })

  scenario('updates a validationRules', async (scenario: StandardScenario) => {
    const original = (await validationRules({
      id: scenario.validationRules.one.id,
    })) as ValidationRules
    const result = await updateValidationRules({
      id: original.id,
      input: { versionId: 'V2024_04_01' },
    })

    expect(result.versionId).toEqual('V2024_04_01')
  })

  scenario('deletes a validationRules', async (scenario: StandardScenario) => {
    const original = (await deleteValidationRules({
      id: scenario.validationRules.one.id,
    })) as ValidationRules
    const result = await validationRules({ id: original.id })

    expect(result).toEqual(null)
  })
})
