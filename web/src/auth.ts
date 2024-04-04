import { createAuthentication } from '@redwoodjs/auth'

import {
  createLocalAuthImplementation,
  localAuthClient,
} from 'src/auth/localAuth'

// If you're integrating with an auth service provider you should delete this interface.
// Instead you should import the type from their auth client sdk.
export interface AuthClient {
  login: () => User
  logout: () => void
  signup: () => User
  getToken: () => string
  getUserMetadata: () => User | null
}

interface Agency {
  name: string
  abbreviation: string
  code: string
  organizationId: number
}

// If you're integrating with an auth service provider you should delete this interface.
// This type should be inferred from the general interface above.
interface User {
  // The name of the id variable will vary depending on what auth service
  // provider you're integrating with. Another common name is `sub`
  id: string
  email?: string
  username?: string
  roles: string[]
  agency: Agency
}

// If you're integrating with an auth service provider you should delete this interface
// This type should be inferred from the general interface above
export interface ValidateResetTokenResponse {
  error?: string
  [key: string]: string | undefined
}

// Replace this with the auth service provider client sdk
const client = {
  login: () => ({
    id: 1,
    email: 'email@example.com',
    organizationId: 1,
    roles: [],
  }),
  signup: () => ({
    id: 1,
    email: 'email@example.com',
    organizationId: 1,
    roles: [],
  }),
  logout: () => {},
  getToken: () => 'super-secret-short-lived-token',
  getUserMetadata: () => ({
    email: 'usdr-admin@usdr.dev',
    name: 'USDR Admin',
    role: 'USDR_ADMIN',
    roles: ['USDR_ADMIN'],
    agency: {
      name: 'Main Agency',
      abbreviation: 'MAUSDR',
      code: 'MAUSDR',
      organizationId: 1,
    },
    agencyId: 1, // TO_DEPRECATE
    organizationId: 1, // TO_DEPRECATE
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
}

function createAuth() {
  if (process.env.AUTH_PROVIDER == 'local') {
    const authImplementation = createLocalAuthImplementation(localAuthClient)
    return createAuthentication(authImplementation)
  } else {
    const authImplementation = createAuthImplementation(client)
    // You can pass custom provider hooks here if you need to as a second
    // argument. See the Redwood framework source code for how that's used
    return createAuthentication(authImplementation)
  }
}

// This is where most of the integration work will take place. You should keep
// the shape of this object (i.e. keep all the key names) but change all the
// values/functions to use methods from the auth service provider client sdk
// you're integrating with
function createAuthImplementation(client: AuthClient) {
  return {
    type: 'custom-auth',
    client,
    login: async () => client.login(),
    logout: async () => client.logout(),
    signup: async () => client.signup(),
    getToken: async () => client.getToken(),
    /**
     * Actual user metadata might look something like this
     * {
     *   "id": "11111111-2222-3333-4444-5555555555555",
     *   "aud": "authenticated",
     *   "role": "authenticated",
     *   "roles": ["admin"],
     *   "email": "email@example.com",
     *   "app_metadata": {
     *     "provider": "email"
     *   },
     *   "user_metadata": null,
     *   "created_at": "2016-05-15T19:53:12.368652374-07:00",
     *   "updated_at": "2016-05-15T19:53:12.368652374-07:00"
     * }
     */
    getUserMetadata: async () => client.getUserMetadata(),
  }
}

export const { AuthProvider, useAuth } = createAuth()
