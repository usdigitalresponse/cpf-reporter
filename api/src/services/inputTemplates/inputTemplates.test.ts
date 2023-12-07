import type { InputTemplate } from '@prisma/client'

import {
  inputTemplates,
  inputTemplate,
  createInputTemplate,
  updateInputTemplate,
  deleteInputTemplate,
} from './inputTemplates'
import type { StandardScenario } from './inputTemplates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('inputTemplates', () => {
  scenario('returns all inputTemplates', async (scenario: StandardScenario) => {
    const result = await inputTemplates()

    expect(result.length).toEqual(Object.keys(scenario.inputTemplate).length)
  })

  scenario(
    'returns a single inputTemplate',
    async (scenario: StandardScenario) => {
      const result = await inputTemplate({ id: scenario.inputTemplate.one.id })

      expect(result).toEqual(scenario.inputTemplate.one)
    }
  )

  scenario('creates a inputTemplate', async () => {
    const result = await createInputTemplate({
      input: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:24.374Z',
        rulesGeneratedAt: '2023-12-07T18:17:24.374Z',
        updatedAt: '2023-12-07T18:17:24.374Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.version).toEqual('String')
    expect(result.effectiveDate).toEqual(new Date('2023-12-07T18:17:24.374Z'))
    expect(result.rulesGeneratedAt).toEqual(
      new Date('2023-12-07T18:17:24.374Z')
    )
    expect(result.updatedAt).toEqual(new Date('2023-12-07T18:17:24.374Z'))
  })

  scenario('updates a inputTemplate', async (scenario: StandardScenario) => {
    const original = (await inputTemplate({
      id: scenario.inputTemplate.one.id,
    })) as InputTemplate
    const result = await updateInputTemplate({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a inputTemplate', async (scenario: StandardScenario) => {
    const original = (await deleteInputTemplate({
      id: scenario.inputTemplate.one.id,
    })) as InputTemplate
    const result = await inputTemplate({ id: original.id })

    expect(result).toEqual(null)
  })
})
