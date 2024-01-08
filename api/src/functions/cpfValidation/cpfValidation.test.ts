// import { S3EventRecord } from 'aws-lambda'

// import { handler } from './cpfValidation'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('cpfValidation function', () => {
  it('Dummy test', () => {
    expect(1 + 1).toBe(2)
  })
  // it('Should respond with 200', async () => {
  //   const record: S3EventRecord = {
  //     eventVersion: '2.0',
  //     eventSource: 'aws:s3',
  //     eventName: 'ObjectCreated:Put',
  //     eventTime: '1970-01-01T00:00:00.000Z',
  //     userIdentity: { principalId: 'test-principalId' },
  //     requestParameters: { sourceIPAddress: 'test-sourceIPAddress' },
  //     responseElements: {
  //       'x-amz-request-id': 'test-x-amz-request-id',
  //       'x-amz-id-2': 'test-x-amz-id-2',
  //     },
  //     awsRegion: 'us-east-1',
  //     s3: {
  //       s3SchemaVersion: '1.0',
  //       configurationId: 'test-configurationId',
  //       bucket: {
  //         name: 'test-bucket',
  //         arn: 'test-arn',
  //         ownerIdentity: {
  //           principalId: 'test-principalId',
  //         },
  //       },
  //       object: {
  //         key: 'test-key',
  //         size: 1234,
  //         eTag: 'test-etag',
  //         sequencer: 'test-sequencer',
  //       },
  //     },
  //   }
  //   const s3Event = {
  //     Records: [record],
  //   }
  //   const response = await handler(s3Event, null, null)
  //   const { data } = JSON.parse(response.body)
  //   expect(response.statusCode).toBe(200)
  //   expect(data).toBe('excelToJson function')
})

// You can also use scenarios to test your api functions
// See guide here: https://redwoodjs.com/docs/testing#scenarios
//
// scenario('Scenario test', async () => {
//
// })
