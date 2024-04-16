import { db } from 'src/lib/db'

import { processRecord } from './processValidationJson'

type DocumentBody = {
  transformToString: () => string
}

class MockS3Client {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: any[] = []
  mockDocumentBody: DocumentBody = { transformToString: () => '' }
  constructor(documentBody: string) {
    if (documentBody) {
      this.mockDocumentBody.transformToString = () => documentBody
    } else {
      this.mockDocumentBody = null
    }
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
        key: `uploads/12/34/56/${uploadValidationId}/{filename}`,
      },
    },
  }
}

describe('cpfValidation function', () => {
  scenario('no validation errors', async (scenario) => {
    const noErrorResults = { errors: [] }
    const expectedBody = JSON.stringify(noErrorResults)
    const mocks3 = new MockS3Client(expectedBody)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    await processRecord(record, mocks3)

    const updatedRecord = await db.uploadValidation.findUnique({
      where: { id: scenario.uploadValidation.one.id },
    })
    expect(mocks3.commands.length).toEqual(2)
    expect(updatedRecord.results).toEqual(noErrorResults)
    expect(updatedRecord.passed).toEqual(true)
  })

  scenario('validation error', async (scenario) => {
    const expectedBody = { errors: 'error' }
    const mocks3 = new MockS3Client(JSON.stringify(expectedBody))
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(2)
    const updatedRecord = await db.uploadValidation.findUnique({
      where: { id: scenario.uploadValidation.one.id },
    })
    expect(updatedRecord.results).toEqual(expectedBody)
    expect(updatedRecord.passed).toEqual(false)
  })

  scenario('no body in s3 object', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1) // No DeleteObjectCommand
    const existingRecord = await db.uploadValidation.findUnique({
      where: { id: scenario.uploadValidation.one.id },
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no matching upload record', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId + 1)

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await db.uploadValidation.findUnique({
      where: { id: scenario.uploadValidation.one.id },
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no key found in path', async (scenario) => {
    const mocks3 = new MockS3Client(null)
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    record.s3.object.key = 'bad-key'

    await processRecord(record, mocks3)
    expect(mocks3.commands.length).toEqual(1)
    const existingRecord = await db.uploadValidation.findUnique({
      where: { id: scenario.uploadValidation.one.id },
    })
    expect(existingRecord.results).toEqual(null)
    expect(existingRecord.passed).toEqual(false)
  })

  scenario('no expenditure category found for result project use code', async (scenario) => {
    const expectedResult = { errors: [], projectUseCode: '13A' }
    const mocks3 = new MockS3Client(JSON.stringify(expectedResult))
    const record = buildRecord(scenario.uploadValidation.one.uploadId)

    expect(
      async () => await processRecord(record, mocks3)
    ).rejects.toThrow('Expenditure category not found')
  })
})
