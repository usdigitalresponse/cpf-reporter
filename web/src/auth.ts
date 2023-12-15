import { PassageUser } from '@passageidentity/passage-elements/passage-user'

import { createAuthentication } from '@redwoodjs/auth'

// If you're integrating with an auth service provider you should delete this interface.
// Instead you should import the type from their auth client sdk.
export interface AuthClient {
  login: () => User
  logout: () => void
  signup: () => User
  getToken: () => string
  getUserMetadata: () => User | null
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
}

// If you're integrating with an auth service provider you should delete this interface
// This type should be inferred from the general interface above
export interface ValidateResetTokenResponse {
  error?: string
  [key: string]: string | undefined
}

// Replace this with the auth service provider client sdk
// const client = {
//   login: () => ({
//     id: 'unique-user-id',
//     email: 'email@example.com',
//     roles: [],
//   }),
//   signup: () => ({
//     id: 'unique-user-id',
//     email: 'email@example.com',
//     roles: [],
//   }),
//   logout: () => {},
//   getToken: () => 'super-secret-short-lived-token',
//   getUserMetadata: () => ({
//     id: 'unique-user-id',
//     email: 'email@example.com',
//     roles: [],
//   }),
// }

const passageUser = new PassageUser()

const passageClient = {
  logout: async () => {
    return await passageUser.signOut()
  },
  getToken: async () => {
    console.log('getAuthToken')
    const token = await passageUser.getAuthToken()
    return token
  },
  getUserMetadata: () => {
    console.log('passageUser.userInfo()')
    return passageUser.userInfo()
  },
  login: (event) => {
    console.log('unsure how to login with passage')
    //return { id: 'unique-user-id', email: '', roles: [] }
    console.log(`successfully authenticated. ${event}`)
    console.log(event)
    localStorage.setItem('psg_auth_token', event.auth_token)
    // window.location.href = event.redirect_url
  },
  signup: () => {
    console.log('unsure how to signup with passage')
    return { id: 'unique-user-id', email: '', roles: [] }
  },
}

console.log('passageUser', passageUser)

function createAuth() {
  const authImplementation = createAuthImplementation(passageClient)

  // You can pass custom provider hooks here if you need to as a second
  // argument. See the Redwood framework source code for how that's used
  return createAuthentication(authImplementation)
}

// This is where most of the integration work will take place. You should keep
// the shape of this object (i.e. keep all the key names) but change all the
// values/functions to use methods from the auth service provider client sdk
// you're integrating with
function createAuthImplementation(client: AuthClient) {
  return {
    type: 'custom-auth',
    client,
    login: async (e) => client.login(e),
    logout: async () => await passageUser.signOut(),
    signup: async () => client.signup(),
    getToken: async () => await passageUser.getAuthToken(),
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
