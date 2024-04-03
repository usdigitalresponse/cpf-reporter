import { db } from 'src/lib/db'

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

scenario('cpfValidation function - no errors', async (scenario) => {
  const expectedBody = JSON.stringify([])
  const mocks3 = new MockS3Client(expectedBody)
  const record = {
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
        key: `/uploads/12/34/56/${scenario.uploadValidation.one.id}/{filename}`,
      },
    },
  }
  await processRecord(record, mocks3)

  const updatedRecord = await db.uploadValidation.findUnique({
    where: { id: scenario.uploadValidation.one.id },
  })
  expect(mocks3.commands.length).toEqual(2)
  expect(updatedRecord.results).toEqual([])
  expect(updatedRecord.passed).toEqual(true)
})

scenario('cpfValidation function - error', async (scenario) => {
  const expectedBody = { error: 'error' }
  const mocks3 = new MockS3Client(JSON.stringify(expectedBody))
  const record = {
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
        key: `/uploads/12/34/56/${scenario.uploadValidation.one.id}/{filename}`,
      },
    },
  }
  await processRecord(record, mocks3)
  expect(mocks3.commands.length).toEqual(2)
  const updatedRecord = await db.uploadValidation.findUnique({
    where: { id: scenario.uploadValidation.one.id },
  })
  expect(updatedRecord.results).toEqual(expectedBody)
  expect(updatedRecord.passed).toEqual(false)
})
