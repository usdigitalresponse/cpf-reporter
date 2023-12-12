import type { OutputTemplate } from '@prisma/client'

import {
  outputTemplates,
  outputTemplate,
  createOutputTemplate,
  updateOutputTemplate,
  deleteOutputTemplate,
} from './outputTemplates'
import type { StandardScenario } from './outputTemplates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('outputTemplates', () => {
  scenario(
    'returns all outputTemplates',
    async (scenario: StandardScenario) => {
      const result = await outputTemplates()

      expect(result.length).toEqual(Object.keys(scenario.outputTemplate).length)
    }
  )

  scenario(
    'returns a single outputTemplate',
    async (scenario: StandardScenario) => {
      const result = await outputTemplate({
        id: scenario.outputTemplate.one.id,
      })

      expect(result).toEqual(scenario.outputTemplate.one)
    }
  )

  scenario('creates a outputTemplate', async () => {
    const result = await createOutputTemplate({
      input: {
        name: 'String',
        version: 'String',
        effectiveDate: '2023-12-07T18:17:34.958Z',
        rulesGeneratedAt: '2023-12-07T18:17:34.958Z',
        updatedAt: '2023-12-07T18:17:34.958Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.version).toEqual('String')
    expect(result.effectiveDate).toEqual(new Date('2023-12-07T00:00:00.000Z'))
    expect(result.rulesGeneratedAt).toEqual(
      new Date('2023-12-07T18:17:34.958Z')
    )
    expect(result.updatedAt).toEqual(new Date('2023-12-07T18:17:34.958Z'))
  })

  scenario('updates a outputTemplate', async (scenario: StandardScenario) => {
    const original = (await outputTemplate({
      id: scenario.outputTemplate.one.id,
    })) as OutputTemplate
    const result = await updateOutputTemplate({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a outputTemplate', async (scenario: StandardScenario) => {
    const original = (await deleteOutputTemplate({
      id: scenario.outputTemplate.one.id,
    })) as OutputTemplate
    const result = await outputTemplate({ id: original.id })

    expect(result).toEqual(null)
  })
})
