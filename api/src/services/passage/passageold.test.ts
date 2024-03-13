describe('Passage users', () => {
  test('creates a Passage user', () => {
    console.log('result', scenario)
  })
})

// // import { createPassageUser, deletePassageUser } from './passage'

// // describe('Passage users', () => {
// //   scenario('creates a Passage user', async (scenario: any) => {
// //     const result = await createPassageUser('hiffromtest@test.com')
// //     console.log('result', result)

// //     expect(result.email).toEqual('hiffromtest@test.com')
// //     expect(result.status).toEqual('active')
// //   })

// //   scenario('deletes a Passage user', async (scenario: any) => {
// //     const result = await deletePassageUser(user.id)
// //     console.log('result', result)

// //     expect(result).toEqual(true)
// //   })
// // })

// import { createPassageUser, deletePassageUser } from './passage'

// describe('Passage users', () => {
//   let userId

//   // Create a user before the tests run
//   beforeAll(async () => {
//     const user = await createPassageUser('passagetestuser@test.com')
//     userId = user.id
//   })

//   it('verifies the created Passage user', () => {
//     expect(userId).toBeDefined()
//     expect(result.email).toEqual('hiffromtest@test.com')
//     expect(result.status).toEqual('active')
//     // You can add more assertions here if you had more data about the created user
//   })

//   it('deletes the Passage user', async () => {
//     const result = await deletePassageUser(userId)

//     expect(result).toEqual(true)
//   })

//   afterAll(async () => {
//     // Optionally clean up any remaining state if necessary
//     // In this case, the user should already be deleted, but you could double-check or clean up other resources
//   })
// })

// import {
//   createPassageUser,
//   deletePassageUser,
//   getPassageClient,
// } from './passage'
// import Passage from '@passageidentity/passage-node'
// import { logger } from 'src/lib/logger'

// // Mock AWS SDK and Passage library
// jest.mock('@aws-sdk/client-secrets-manager', () => ({
//   SecretsManagerClient: jest.fn().mockImplementation(() => ({
//     send: jest.fn().mockResolvedValue({ SecretString: 'mock-api-key' }),
//   })),
//   GetSecretValueCommand: jest.fn(),
// }))

// // afterEach(jest.clearAllMocks)

// jest.mock('@passageidentity/passage-node', () => {
//   return {
//     __esModule: true,
//     default: jest.fn().mockImplementation(() => ({
//       user: {
//         create: jest.fn().mockResolvedValue({
//           id: 'mockUserId',
//           email: 'test@example.com',
//           status: 'active',
//         }),
//         activate: jest.fn().mockResolvedValue({ activated: true }),
//         delete: jest.fn().mockResolvedValue(true),
//       },
//     })),
//   }
// })

// jest.mock('src/lib/logger', () => ({
//   error: jest.fn(),
// }))

// describe('Passage service functionality', () => {
//   describe('getPassageClient', () => {
//     it('should return a Passage client instance', async () => {
//       const client = await getPassageClient()
//       expect(client).toBeDefined()
//       // Assuming Passage is correctly mocked above
//     })

//     it('should log an error and throw when Passage client initialization fails', async () => {
//       // Mock the Passage constructor to throw an error for this test
//       Passage.mockImplementationOnce(() => {
//         throw new Error('Initialization failed')
//       })

//       await expect(getPassageClient()).rejects.toThrow(
//         'Error getting Passage client'
//       )
//       expect(logger.error).toHaveBeenCalled()
//     })
//   })

//   describe('createPassageUser', () => {
//     it('creates and activates a Passage user', async () => {
//       const email = 'test@example.com'
//       const user = await createPassageUser(email)

//       expect(user.status).toBeTruthy()
//       expect(Passage.mock.calls[0][0].user.create).toHaveBeenCalledWith({
//         email,
//       })
//       expect(Passage.mock.calls[0][0].user.activate).toHaveBeenCalledWith(
//         'mockUserId'
//       )
//     })

//     it('logs an error and throws when user creation fails', async () => {
//       Passage.mockImplementationOnce(() => ({
//         user: {
//           create: jest
//             .fn()
//             .mockRejectedValue(new Error('User creation failed')),
//           activate: jest.fn(),
//         },
//       }))

//       await expect(createPassageUser('test@example.com')).rejects.toThrow(
//         'Failed to create Passage user'
//       )
//       expect(logger.error).toHaveBeenCalledWith(
//         expect.stringContaining('Failed to create Passage user'),
//         expect.any(Error)
//       )
//     })
//   })

//   describe('deletePassageUser', () => {
//     it('deletes a Passage user', async () => {
//       const userId = 'mockUserId'
//       const result = await deletePassageUser(userId)

//       expect(result).toBe(true)
//       expect(Passage.mock.calls[0][0].user.delete).toHaveBeenCalledWith(userId)
//     })

//     it('logs an error and throws when user deletion fails', async () => {
//       Passage.mockImplementationOnce(() => ({
//         user: {
//           delete: jest
//             .fn()
//             .mockRejectedValue(new Error('User deletion failed')),
//         },
//       }))

//       await expect(deletePassageUser('mockUserId')).rejects.toThrow(
//         'Failed to delete Passage user'
//       )
//       expect(logger.error).toHaveBeenCalledWith(
//         expect.stringContaining('Failed to delete Passage user'),
//         expect.any(Error)
//       )
//     })
//   })
// })
