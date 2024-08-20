import type { OutputTemplate } from '@prisma/client'

import {
  outputTemplates,
  outputTemplate,
  createOutputTemplate,
  updateOutputTemplate,
  deleteOutputTemplate,
  getOrCreateOutputTemplate,
} from './outputTemplates'
import type { StandardScenario } from './outputTemplates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('outputTemplates', () => {
  scenario('gets or creates output template', async () => {
    const result = await getOrCreateOutputTemplate({
      name: 'NEW TEMPLATE',
      version: '1.0.0',
      effectiveDate: '2023-12-07T18:17:34.958Z',
    })

    expect(result.name).toEqual('NEW TEMPLATE')
    expect(result.version).toEqual('1.0.0')
    expect(result.effectiveDate).toEqual(new Date('2023-12-07T00:00:00.000Z'))
    expect(result.updatedAt).toBeDefined()
  })
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
        effectiveDate: '2024-08-19T20:09:50.481Z',
        filenames: {
          CPF1A: 'String',
          CPF1B: 'String',
          CPF1C: 'String',
          CPFSubrecipient: 'String',
        },
      },
    })

    expect(result.outputTemplate.name).toEqual('String')
    expect(result.outputTemplate.version).toEqual('String')
    expect(result.outputTemplate.effectiveDate).toEqual(
      new Date('2024-08-19T00:00:00.000Z')
    )
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
