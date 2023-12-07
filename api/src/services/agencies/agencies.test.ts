import type { Agency } from '@prisma/client'

import {
  agencies,
  agency,
  createAgency,
  updateAgency,
  deleteAgency,
} from './agencies'
import type { StandardScenario } from './agencies.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('agencies', () => {
  scenario('returns all agencies', async (scenario: StandardScenario) => {
    const result = await agencies()

    expect(result.length).toEqual(Object.keys(scenario.agency).length)
  })

  scenario('returns a single agency', async (scenario: StandardScenario) => {
    const result = await agency({ id: scenario.agency.one.id })

    expect(result).toEqual(scenario.agency.one)
  })

  scenario('creates a agency', async () => {
    const result = await createAgency({
      input: { name: 'String', code: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.code).toEqual('String')
  })

  scenario('updates a agency', async (scenario: StandardScenario) => {
    const original = (await agency({ id: scenario.agency.one.id })) as Agency
    const result = await updateAgency({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a agency', async (scenario: StandardScenario) => {
    const original = (await deleteAgency({
      id: scenario.agency.one.id,
    })) as Agency
    const result = await agency({ id: original.id })

    expect(result).toEqual(null)
  })
})
