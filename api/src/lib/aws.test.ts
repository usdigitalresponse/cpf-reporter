import { APIGatewayEvent } from 'aws-lambda'

import { getCurrentUser } from 'src/lib/auth'
import { getS3UploadFileKey } from 'src/lib/aws'
import { db } from 'src/lib/db'

jest.mock('src/lib/db', () => ({
  db: {
    user: {
      findFirst: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the user when AUTH_PROVIDER is "local"', async () => {
    process.env.AUTH_PROVIDER = 'local'
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'ORGANIZATION_STAFF',
      agency: { id: 1 },
    }
    db.user.findFirst.mockResolvedValue(mockUser)

    const result = await getCurrentUser(
      null,
      { token: 'test@example.com' },
      { event: {} as APIGatewayEvent }
    )

    expect(db.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      include: { agency: true },
    })
    expect(result).toEqual({
      ...mockUser,
      roles: [mockUser.role],
    })
  })

  it('should return the user when AUTH_PROVIDER is "passage" and using api gateway v1.0', async () => {
    process.env.AUTH_PROVIDER = 'passage'
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'ORGANIZATION_STAFF',
      agency: { id: 1 },
    }
    db.user.findFirst.mockResolvedValue(mockUser)

    const event = {
      requestContext: {
        authorizer: {
          claims: {
            sub: 'passage-user-id',
          },
        },
      },
    } as unknown as APIGatewayEvent

    const result = await getCurrentUser(null, { token: '' }, { event })

    expect(db.user.findFirst).toHaveBeenCalledWith({
      where: { passageId: 'passage-user-id' },
      include: { agency: true },
    })
    expect(result).toEqual({
      ...mockUser,
      roles: [mockUser.role],
    })
  })

  it('should throw an error when passageId is missing', async () => {
    process.env.AUTH_PROVIDER = 'passage'

    const event = {
      requestContext: {
        authorizer: {
          claims: {},
        },
      },
    } as unknown as APIGatewayEvent

    const result = await getCurrentUser(null, { token: '' }, { event })

    expect(db.user.findFirst).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should throw an error when using api gateway payload v2.0', async () => {
    process.env.AUTH_PROVIDER = 'passage'

    // version 2.0 structure of the API gateway should fail even if the passageId is present
    const event = {
      requestContext: {
        authorizer: {
          jwt: {
            claims: {
              sub: 'passage-user-id',
            },
          },
        },
      },
    } as unknown as APIGatewayEvent

    const result = await getCurrentUser(null, { token: '' }, { event })

    expect(db.user.findFirst).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })
})

describe('getS3UploadFileKey', () => {
  it('should return a valid s3 upload key based on the upload', () => {
    const upload = {
      id: 1,
      filename: 'test.csv',
      uploadedById: 1,
      agencyId: 2,
      reportingPeriodId: 3,
      expenditureCategoryId: 4,
      createdAt: '2024-01-26T15:11:27.000Z',
      updatedAt: '2024-01-26T15:11:27.000Z',
      validations: [],
    }
    expect(getS3UploadFileKey(10, upload)).toEqual(
      'uploads/10/2/3/1/test.csv'
    )
  })

  it('should return a valid s3 upload key based on the upload with no id', () => {
    const upload = {
      filename: 'test.csv',
      uploadedById: 1,
      agencyId: 2,
      reportingPeriodId: 3,
      expenditureCategoryId: 4,
      createdAt: '2024-01-26T15:11:27.000Z',
      updatedAt: '2024-01-26T15:11:27.000Z',
      validations: [],
    }
    expect(getS3UploadFileKey(10, upload, 11)).toEqual(
      'uploads/10/2/3/11/test.csv'
    )
  })
})
