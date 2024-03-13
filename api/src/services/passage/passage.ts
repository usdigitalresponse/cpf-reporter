import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager'

import Passage from '@passageidentity/passage-node'
import { logger } from 'src/lib/logger'

export const getPassageClient = async () => {
  try {
    const passageConfig = {
      appID: process.env.PASSAGE_APP_ID,
      apiKey: await getPassageAPIKey(),
    }

    return new Passage(passageConfig)
  } catch (error) {
    logger.error('Error getting Passage client:', error)
    throw new Error('Error getting Passage client')
  }
}

export const createPassageUser = async (email: string) => {
  try {
    let passage = await getPassageClient()
    const newUser = await passage.user.create({ email: email })
    const activatedUser = await passage.user.activate(newUser.id)
    console.log('activatedUser', activatedUser)
    return activatedUser
  } catch (error) {
    logger.error('Failed to create Passage user', error)
    throw new Error('Failed to create Passage user', error)
  }
}

export const deletePassageUser = async (userId: string) => {
  try {
    let passage = await getPassageClient()
    return await passage.user.delete(userId)
  } catch (error) {
    logger.error('Failed to delete Passage user', error)
    throw new Error('Failed to delete Passage user')
  }
}

/**
 * Gets the Passage API key to use for authenticating Passage SDK calls.
 *
 * @param setEnv - If true, caches the Passage API key to $PASSAGE_API_KEY environment variable.
 * @param force - If true, forces retrieval of the Passage API key from AWS Secrets Manager,
 *  even if the $PASSAGE_API_KEY environment variable is already set. This can be useful when
 *  the secret API key value has changed (e.g. due to rotation). If the value returned by this
 *  function is rejected by a subsequent Passage API operation, it may be worth calling this function
 *  once more with `force = true` to attempt to retrieve a more recent, valid key, instead of
 *  failing immediately.
 *
 * @returns The Passage API key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getPassageAPIKey(setEnv = true, force = false): Promise<string> {
  if (process.env.PASSAGE_API_KEY && !force) {
    // API key is already cached in env var
    return process.env.PASSAGE_API_KEY
  }

  const client = new SecretsManagerClient()
  const resp = await client.send(
    new GetSecretValueCommand({
      SecretId: process.env.PASSAGE_API_KEY_SECRET_ARN,
    })
  )

  if (setEnv) {
    process.env.PASSAGE_API_KEY = resp.SecretString
  }

  return resp.SecretString
}
