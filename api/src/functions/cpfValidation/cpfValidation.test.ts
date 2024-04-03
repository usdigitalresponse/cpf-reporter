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

function buildRecord(uploadId: string) {
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
        key: `/uploads/12/34/56/${uploadId}/{filename}`,
      },
    },
  }
}

describe('cpfValidation function', () => {
  scenario('no validation errors', async (scenario) => {
    const expectedBody = JSON.stringify([])
    const mocks3 = new MockS3Client(expectedBody)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)
    console.log(scenario, 'scenario')

    await processRecord(record, mocks3)

    const updatedRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    console.log(updatedRecord, [])
    expect(mocks3.commands.length).toEqual(2)
    expect(updatedRecord.results).toEqual({ result: [] })
    expect(updatedRecord.passed).toEqual(true)
  })

  scenario('validation error', async (scenario) => {
    const expectedBody = [{ error: 'error' }]
    const mocks3 = new MockS3Client(JSON.stringify(expectedBody))
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(2)
    const updatedRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    console.log(updatedRecord, expectedBody)
    expect(updatedRecord.results).toEqual({ result: expectedBody })
    expect(updatedRecord.passed).toEqual(false)
  })

  scenario('no body in s3 object', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1) // No DeleteObjectCommand
    const existingRecord = await await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    console.log(existingRecord, null)
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no matching upload record', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId + 1)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    console.log(existingRecord, null)
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no key found in path', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    record.s3.object.key = 'bad-key'

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await uploadValidation({
      id: scenario.uploadValidation.one.id,
    })
    console.log(existingRecord, null)
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })
})
