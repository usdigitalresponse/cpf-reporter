import { createAuthentication } from '@redwoodjs/auth'

import {
  createLocalAuthImplementation,
  localAuthClient,
} from 'src/auth/localAuth'
import {
  createPassageAuthImplementation,
  passageAuthClient,
} from 'src/auth/passageAuth'

function createAuth() {
  if (process.env.AUTH_PROVIDER == 'local') {
    const authImplementation = createLocalAuthImplementation(localAuthClient)
    return createAuthentication(authImplementation)
  } else if (
    process.env.AUTH_PROVIDER == 'passage' ||
    window.APP_CONFIG?.webConfigParams?.AUTH_PROVIDER == 'passage'
  ) {
    const authImplementation =
      createPassageAuthImplementation(passageAuthClient)
    return createAuthentication(authImplementation)
  } else {
    throw Error('Authentication not implemented')
  }
}

export const { AuthProvider, useAuth } = createAuth()
