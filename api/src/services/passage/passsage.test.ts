import * as passageModule from '@passageidentity/passage-node'

import { logger } from 'src/lib/logger'

import { createPassageUser, deletePassageUser } from './passage'

jest.mock('@passageidentity/passage-node')
jest.mock('src/lib/logger')

const mockedPassage = passageModule.default as jest.Mocked<
  typeof passageModule.default
>
const mockedLogger = logger as jest.Mocked<typeof logger>

describe('Passage User Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createPassageUser', () => {
    it('should create and activate a Passage user with the given email', async () => {
      const email = 'test@example.com'
      const newUser = { id: '123', email }
      const activatedUser = { ...newUser, activated: true }

      const passageInstance = {
        user: {
          create: jest.fn().mockResolvedValue(newUser),
          activate: jest.fn().mockResolvedValue(activatedUser),
        },
      }

      mockedPassage.mockImplementation(() => passageInstance)

      const result = await createPassageUser(email)

      expect(passageInstance.user.create).toHaveBeenCalledWith({ email })
      expect(passageInstance.user.activate).toHaveBeenCalledWith(newUser.id)
      expect(result).toEqual(activatedUser)
    })

    it('should log an error and throw if user creation fails', async () => {
      const email = 'test@example.com'
      const error = new Error('User creation failed')

      const passageInstance = {
        user: {
          create: jest.fn().mockRejectedValue(error),
        },
      }

      mockedPassage.mockImplementation(() => passageInstance)

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

      const passageInstance = {
        user: {
          delete: jest.fn().mockResolvedValue(true),
        },
      }

      mockedPassage.mockImplementation(() => passageInstance)

      const result = await deletePassageUser(userId)

      expect(passageInstance.user.delete).toHaveBeenCalledWith(userId)
      expect(result).toBe(true)
    })

    it('should log an error and throw if user deletion fails', async () => {
      const userId = '123'
      const error = new Error('User deletion failed')

      const passageInstance = {
        user: {
          delete: jest.fn().mockRejectedValue(error),
        },
      }

      mockedPassage.mockImplementation(() => passageInstance)

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
