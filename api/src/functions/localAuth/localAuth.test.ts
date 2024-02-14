import { mockHttpEvent } from '@redwoodjs/testing/api'

import { handler, LocalAuthResponse } from './localAuth'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

describe('localAuth function', () => {
  it('GET requests should respond with 405', async () => {
    const httpEvent = mockHttpEvent({
      httpMethod: 'GET',
      queryStringParameters: {
        id: '42', // Add parameters here
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await handler(httpEvent, null)
    expect(response.statusCode).toBe(405)
  })

  it('POST request for invalid user should respond with 404', async () => {
    const httpEvent = mockHttpEvent({
      httpMethod: 'POST',
      payload: JSON.stringify({
        authMethod: 'getUserMetadata',
        email: 'foo@example.com',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await handler(httpEvent, null)
    expect(response.statusCode).toBe(404)
  })

  scenario(
    'POST request for valid user should respond with 200 and user',
    async (scenario) => {
      console.log(scenario)
      const httpEvent = mockHttpEvent({
        httpMethod: 'POST',
        payload: JSON.stringify({
          authMethod: 'getUserMetadata',
          email: 'grants-admin@usdr.dev',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response: LocalAuthResponse = await handler(httpEvent, null)
      console.log(response)
      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(
        JSON.stringify({
          data: {
            user: {
              id: scenario.user.one.id,
              email: scenario.user.one.email,
              name: scenario.user.one.name,
              agencyId: scenario.user.one.agency.id,
              organizationId: scenario.user.one.organization.id,
              createdAt: scenario.user.one.createdAt,
              updatedAt: scenario.user.one.updatedAt,
              role: scenario.user.one.role,
            },
          },
        })
      )
    }
  )

  // You can also use scenarios to test your api functions
  // See guide here: https://redwoodjs.com/docs/testing#scenarios
  //
  // scenario('Scenario test', async () => {
  //
  // })
})
