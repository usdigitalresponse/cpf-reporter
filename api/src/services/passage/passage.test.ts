import { logger } from 'src/lib/logger'

import { createPassageUser, deletePassageUser } from './passage'

const mockPassageUser = {
  create: jest.fn(),
  activate: jest.fn(),
  delete: jest.fn(),
}

jest.mock('@passageidentity/passage-node', () => {
  return jest.fn().mockImplementation(() => ({
    user: mockPassageUser,
  }))
})

jest.mock('src/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

const mockedLogger = logger as jest.Mocked<typeof logger>

describe('Passage User Management', () => {
  beforeAll(() => {
    process.env.PASSAGE_API_KEY = 'fake_api_key'
    process.env.PASSAGE_APP_ID = 'fake_app_id'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createPassageUser', () => {
    it('should create and activate a Passage user with the given email', async () => {
      const email = 'test@example.com'
      const newUser = { id: '123', email }
      const activatedUser = { ...newUser, activated: true }

      mockPassageUser.create.mockResolvedValue(newUser)
      mockPassageUser.activate.mockResolvedValue(activatedUser)

      const result = await createPassageUser(email)

      expect(mockPassageUser.create).toHaveBeenCalledWith({ email })
      expect(mockPassageUser.activate).toHaveBeenCalledWith(newUser.id)
      expect(result).toEqual(activatedUser)
    })

    it('should log an error and throw if user creation fails', async () => {
      const email = 'test@example.com'
      const error = new Error('User creation failed')

      mockPassageUser.create.mockRejectedValue(error)

      await expect(createPassageUser(email)).rejects.toThrow(
        'Failed to create Passage user'
      )

      expect(mockedLogger.error).toHaveBeenCalledWith(
        'Failed to create Passage user',
        error
      )
    })
  })

  describe('deletePassageUser', () => {
    it('should delete a Passage user with the given user ID', async () => {
      const userId = '123'

      mockPassageUser.delete.mockResolvedValue(true)

      const result = await deletePassageUser(userId)

      expect(mockPassageUser.delete).toHaveBeenCalledWith(userId)
      expect(result).toBe(true)
    })

    it('should log an error and throw if user deletion fails', async () => {
      const userId = '123'
      const error = new Error('User deletion failed')

      mockPassageUser.delete.mockRejectedValue(error)

      await expect(deletePassageUser(userId)).rejects.toThrow(
        'Failed to delete Passage user'
      )

      expect(mockedLogger.error).toHaveBeenCalledWith(
        'Failed to delete Passage user',
        error
      )
    })
  })
})
