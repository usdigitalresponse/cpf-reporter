import type { Agency } from '@prisma/client'

import {
  agencies,
  agency,
  createAgency,
  updateAgency,
  deleteAgency,
  getOrCreateAgencies,
} from './agencies'
import type { StandardScenario } from './agencies.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('agencies', () => {
  scenario('get or creates new agencies', async (scenario: StandardScenario) => {
    const result = await getOrCreateAgencies(scenario.organization.one.name, [
      { name: 'Agency1', code: 'A1', abbreviation: 'A1'},
      { name: 'Agency3', code: 'A3', abbreviation: 'A3'}
    ])

    expect(result.length).toEqual(2)
    expect(result[0].name).toEqual('Agency1')
    expect(result[0].id).toEqual(scenario.agency.one.id)
    expect(result[1].name).toEqual('Agency3')
  })
  scenario('returns all agencies', async (scenario: StandardScenario) => {
    const result = await agencies()

    expect(result.length).toEqual(Object.keys(scenario.agency).length)
  })

  scenario('returns a single agency', async (scenario: StandardScenario) => {
    const result = await agency({ id: scenario.agency.one.id })

    expect(result.id).toEqual(scenario.agency.one.id)
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
