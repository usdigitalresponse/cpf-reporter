import type { Subrecipient } from '@prisma/client'

import {
  subrecipients,
  subrecipient,
  createSubrecipient,
  updateSubrecipient,
  deleteSubrecipient,
} from './subrecipients'
import type { StandardScenario } from './subrecipients.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subrecipients', () => {
  scenario('returns all subrecipients', async (scenario: StandardScenario) => {
    const result = await subrecipients()

    expect(result.length).toEqual(Object.keys(scenario.subrecipient).length)
  })

  scenario(
    'returns a single subrecipient',
    async (scenario: StandardScenario) => {
      const result = await subrecipient({ id: scenario.subrecipient.one.id })

      expect(result).toEqual(scenario.subrecipient.one)
    }
  )

  scenario('creates a subrecipient', async (scenario: StandardScenario) => {
    const result = await createSubrecipient({
      input: {
        name: 'String',
        organizationId: scenario.subrecipient.two.organizationId,
        startDate: '2023-12-09T14:50:18.092Z',
        endDate: '2023-12-09T14:50:18.092Z',
        originationUploadId: scenario.subrecipient.two.originationUploadId,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.organizationId).toEqual(
      scenario.subrecipient.two.organizationId
    )
    expect(result.startDate).toEqual(new Date('2023-12-09T00:00:00.000Z'))
    expect(result.endDate).toEqual(new Date('2023-12-09T00:00:00.000Z'))
    expect(result.originationUploadId).toEqual(
      scenario.subrecipient.two.originationUploadId
    )
    expect(result.updatedAt).toBeDefined()
  })

  scenario('updates a subrecipient', async (scenario: StandardScenario) => {
    const original = (await subrecipient({
      id: scenario.subrecipient.one.id,
    })) as Subrecipient
    const result = await updateSubrecipient({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a subrecipient', async (scenario: StandardScenario) => {
    const original = (await deleteSubrecipient({
      id: scenario.subrecipient.one.id,
    })) as Subrecipient
    const result = await subrecipient({ id: original.id })

    expect(result).toEqual(null)
  })
})
