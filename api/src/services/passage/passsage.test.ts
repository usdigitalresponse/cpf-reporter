import { createPassageUser, deletePassageUser } from './passage'

jest.mock('@aws-sdk/client-secrets-manager', () => {
  return {
    SecretsManagerClient: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockResolvedValue({
          SecretString: 'mock_api_key',
        }),
      }
    }),
    GetSecretValueCommand: jest.fn(),
  }
})

jest.mock('@passageidentity/passage-node', () => {
  return function () {
    return {
      user: {
        create: jest.fn().mockResolvedValue({
          id: 'mock_user_id',
          email: 'mock_email@example.com',
        }),
        activate: jest.fn().mockResolvedValue({
          id: 'activated_user',
          email: 'mock_email@example.com',
          status: 'active',
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    }
  }
})

beforeAll(() => {
  process.env.PASSAGE_APP_ID = 'mock_app_id'
  process.env.PASSAGE_API_KEY_SECRET_ARN = 'mock_secret_arn'
})

describe('createPassageUser', () => {
  it('creates and activates a new user', async () => {
    const email = 'test@example.com'
    const output = await createPassageUser(email)

    // it calls passage.user.create with the email
    // expect(passage.user.create).toHaveBeenCalledWith({ email })

    // it calls passage.user.activate with the user id provided by passage.user.create
    // expect(user.activate).toHaveBeenCalledWith('mock_user_id')

    // it returns the async result of passage.user.activate(newUser.id)
    expect(output.id).toBe('activated_user')
  })
})

describe('deletePassageUser', () => {
  it('deletes a user', async () => {
    const userId = 'mock_user_id'
    const result = await deletePassageUser(userId)

    expect(result).toBe(true)
  })
})
