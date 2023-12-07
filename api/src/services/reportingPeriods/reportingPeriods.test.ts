import type { ReportingPeriod } from '@prisma/client'

import {
  reportingPeriods,
  reportingPeriod,
  createReportingPeriod,
  updateReportingPeriod,
  deleteReportingPeriod,
} from './reportingPeriods'
import type { StandardScenario } from './reportingPeriods.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('reportingPeriods', () => {
  scenario(
    'returns all reportingPeriods',
    async (scenario: StandardScenario) => {
      const result = await reportingPeriods()

      expect(result.length).toEqual(
        Object.keys(scenario.reportingPeriod).length
      )
    }
  )

  scenario(
    'returns a single reportingPeriod',
    async (scenario: StandardScenario) => {
      const result = await reportingPeriod({
        id: scenario.reportingPeriod.one.id,
      })

      expect(result).toEqual(scenario.reportingPeriod.one)
    }
  )

  scenario('creates a reportingPeriod', async (scenario: StandardScenario) => {
    const result = await createReportingPeriod({
      input: {
        name: 'String',
        startDate: '2023-12-07T18:38:12.341Z',
        endDate: '2023-12-07T18:38:12.341Z',
        inputTemplateId: scenario.reportingPeriod.two.inputTemplateId,
        outputTemplateId: scenario.reportingPeriod.two.outputTemplateId,
        updatedAt: '2023-12-07T18:38:12.341Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.startDate).toEqual(new Date('2023-12-07T00:00:00.000Z'))
    expect(result.endDate).toEqual(new Date('2023-12-07T00:00:00.000Z'))
    expect(result.inputTemplateId).toEqual(
      scenario.reportingPeriod.two.inputTemplateId
    )
    expect(result.outputTemplateId).toEqual(
      scenario.reportingPeriod.two.outputTemplateId
    )
    expect(result.updatedAt).toEqual(new Date('2023-12-07T18:38:12.341Z'))
  })

  scenario('updates a reportingPeriod', async (scenario: StandardScenario) => {
    const original = (await reportingPeriod({
      id: scenario.reportingPeriod.one.id,
    })) as ReportingPeriod
    const result = await updateReportingPeriod({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a reportingPeriod', async (scenario: StandardScenario) => {
    const original = (await deleteReportingPeriod({
      id: scenario.reportingPeriod.one.id,
    })) as ReportingPeriod
    const result = await reportingPeriod({ id: original.id })

    expect(result).toEqual(null)
  })
})
