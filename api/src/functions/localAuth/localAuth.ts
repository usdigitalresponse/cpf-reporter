import type { APIGatewayEvent, Context } from 'aws-lambda'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */
export const handler = async (event: APIGatewayEvent, _context: Context) => {
  logger.info(`${event.httpMethod} ${event.path}: localAuth function`)
  console.log(event)
  console.log(event.queryStringParameters)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:8910',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        data: 'localAuth function',
      }),
    }
  } else if (event.httpMethod === 'POST') {
    const method = event.queryStringParameters?.method
    let body
    if (event.body) {
      body = JSON.parse(event.body)
    }
    if (!method) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8910',
          'Access-Control-Allow-Headers': '*',
        },
        body: JSON.stringify({
          data: 'localAuth function',
        }),
      }
    }
    // grants-admin@usdigitalresponse.org
    if (method === 'userMetadata') {
      console.log('login')
      if (!(body && body.email)) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8910',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            data: 'localAuth function',
          }),
        }
      }
      const user = await db.user.findFirst({
        where: { email: body.email },
      })

      if (user) {
        console.log('user found', user)
        const resp = {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8910',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            data: { user },
          }),
        }
        console.log(resp)
        return resp
      } else {
        console.log('user not found')
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8910',
            'Access-Control-Allow-Headers': '*',
          },
          body: JSON.stringify({
            user: null,
          }),
        }
      }
    } else if (method === 'signup') {
      console.log('signup')
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:8910',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      data: 'localAuth function',
    }),
  }
}
