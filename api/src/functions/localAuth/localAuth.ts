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

export interface LocalAuthResponse {
  statusCode: number
  headers: { [key: string]: string }
  body?: string
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'http://localhost:8910',
  'Access-Control-Allow-Headers': '*',
}

const handleOptions = () => {
  return {
    statusCode: 200,
    headers: defaultHeaders,
  }
}

const handleGetUserMetadata = async (event: APIGatewayEvent) => {
  console.log('getting user metadata')
  let body
  if (event.body) {
    body = JSON.parse(event.body)
  }
  if (!(body && body.email)) {
    return {
      statusCode: 400,
      headers: defaultHeaders,
    }
  }
  const user = await db.user.findFirst({
    where: { email: body.email },
  })

  if (user) {
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        data: { user },
      }),
    }
  } else {
    return {
      statusCode: 404,
      headers: defaultHeaders,
    }
  }
}

const handlePost = (event: APIGatewayEvent) => {
  let body
  if (event.body) {
    body = JSON.parse(event.body)
  }

  if (!(body && body.authMethod)) {
    return {
      statusCode: 400,
      headers: defaultHeaders,
    }
  }

  if (body.authMethod === 'getUserMetadata') {
    return handleGetUserMetadata(event)
  } else if (body.authMethod === 'login') {
    // since we're not maintaining a session, we can verify the existence of the user
    // through the use of getting the user metadata
    return handleGetUserMetadata(event)
  } else {
    return {
      statusCode: 400,
      headers: defaultHeaders,
    }
  }
}

export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<LocalAuthResponse> => {
  logger.info(`${event.httpMethod} ${event.path}: localAuth function`)

  if (event.httpMethod === 'OPTIONS') {
    return handleOptions()
  } else if (event.httpMethod === 'POST') {
    return handlePost(event)
  } else {
    return {
      statusCode: 405,
      headers: defaultHeaders,
    }
  }
}
