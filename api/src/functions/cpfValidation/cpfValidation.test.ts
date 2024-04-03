import { uploadValidation } from 'src/services/uploadValidations/uploadValidations'

import { processRecord } from './cpfValidation'

class MockS3Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: any[] = []
  mockDocumentBody: string
  constructor(documentBody: string) {
    this.mockDocumentBody = documentBody
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(command: any) {
    this.commands.push(command)
    return Promise.resolve({ Body: this.mockDocumentBody })
  }
}

function buildRecord(uploadValidationId: string) {
  return {
    s3: {
      s3SchemaVersion: '1.0',
      configurationId: 'test-configurationId',
      bucket: {
        name: 'test-bucket',
        arn: 'test-arn',
        ownerIdentity: {
          principalId: 'test-principalId',
        },
      },
      object: {
        key: `/uploads/12/34/56/${uploadValidationId}/{filename}`,
      },
    },
  }
}

describe('cpfValidation function', () => {
  scenario('no validation errors', async (scenario) => {
    const expectedBody = JSON.stringify([])
    const mocks3 = new MockS3Client(expectedBody)
    const record = buildRecord(scenario.uploadValidation.one.id)

    await processRecord(record, mocks3)

    const updatedRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    expect(mocks3.commands.length).toEqual(2)
    expect(updatedRecord.results).toEqual([])
    expect(updatedRecord.passed).toEqual(true)
  })

  scenario('validation error', async (scenario) => {
    const expectedBody = { error: 'error' }
    const mocks3 = new MockS3Client(JSON.stringify(expectedBody))
    const record = buildRecord(scenario.uploadValidation.one.id)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(2)
    const updatedRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    expect(updatedRecord.results).toEqual(expectedBody)
    expect(updatedRecord.passed).toEqual(false)
  })

  scenario('no body in s3 object', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.id)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1) // No DeleteObjectCommand
    const existingRecord = await await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no matching upload record', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.id + 1)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no key found in path', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.id)

    record.s3.object.key = 'bad-key'

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })
})
