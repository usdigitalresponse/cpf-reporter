// eslint-disable-next-line import/order, @typescript-eslint/no-unused-vars
import { tracer } from 'src/lib/tracer'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db, getPrismaClient } from 'src/lib/db'
import { logger } from 'src/lib/logger'

async function wrappedGetCurrentUser(decoded, { token }, { event }) {
  await getPrismaClient()
  return getCurrentUser(decoded, { token }, { event })
}

export const handler = createGraphQLHandler({
  getCurrentUser: wrappedGetCurrentUser,
  loggerConfig: { logger, options: { requestId: true, operationName: true } },
  directives,
  sdls,
  services,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
