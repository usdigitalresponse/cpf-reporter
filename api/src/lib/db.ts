// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.
// eslint-disable-next-line import/order, @typescript-eslint/no-unused-vars
import { tracer } from './tracer'

import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import { Signer } from '@aws-sdk/rds-signer'
import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

async function rdsIAMAuthForURL(databaseURL: string): Promise<string> {
  const url = new URL(databaseURL)
  const signer = new Signer({
    hostname: url.hostname,
    port: parseInt(url.port),
    username: url.username,
  })
  url.password = await signer.getAuthToken()
  return url.toString()
}

async function ssmAuthForURL(databaseURL: string): Promise<string> {
  const url = new URL(databaseURL)
  const ssm = new SSMClient()
  const response = await ssm.send(
    new GetParameterCommand({
      Name: process.env.DATABASE_SECRET_SSM_PARAMETER_PATH,
      WithDecryption: true,
    })
  )
  url.password = response.Parameter.Value
  return url.toString()
}

function pgpasswordAuthForURL(databaseURL: string): string {
  const url = new URL(databaseURL)
  url.password = process.env.PGPASSWORD
  return url.toString()
}

/*
 * Instance of the Prisma Client
 */
export let db: PrismaClient
async function createPrismaClient() {
  let datasourceUrl: string
  if (process.env.DATABASE_SECRET_SOURCE === 'iam') {
    datasourceUrl = await rdsIAMAuthForURL(process.env.DATABASE_URL)
  } else if (process.env.DATABASE_SECRET_SOURCE === 'ssm') {
    datasourceUrl = await ssmAuthForURL(process.env.DATABASE_URL)
  } else if (process.env.DATABASE_SECRET_SOURCE === 'env_PGPASSWORD') {
    datasourceUrl = pgpasswordAuthForURL(process.env.DATABASE_URL)
  }

  db = new PrismaClient({
    log: emitLogLevels(['info', 'warn', 'error']),
    datasourceUrl: datasourceUrl,
  })
}

createPrismaClient().then(() => {
  handlePrismaLogging({
    db,
    logger,
    logLevels: ['info', 'warn', 'error'],
  })
})
