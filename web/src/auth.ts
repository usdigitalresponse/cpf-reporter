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

function getPassageUser() {
  if (localStorage.getItem('psg_auth_token')) {
    return new PassageUser(localStorage.getItem('psg_auth_token'))
  } else {
    return null
  }
}

function createAuth() {
  let client

  if (process.env.AUTH_PROVIDER === 'local') {
    client = {
      logout: async () => {
        localStorage.removeItem('local_auth_token')
        window.location.href = '/login'
      },
      getToken: async () => {
        return localStorage.getItem('local_auth_token')
      },
      getUserMetadata: async () => {
        console.log('local: getUserMetadata')
        let user
        await fetch('http://localhost:8911/localAuth?method=userMetadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: localStorage.getItem('local_auth_token'),
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
            return Promise.reject(response)
          })
          .then((jsonData) => {
            user = jsonData
          })
          .catch((error) => {
            console.log(error.status)
            throw new Error('Error getting user metadata')
          })
        console.log('user', user)
        console.log('3')
        return 'foo'
      },
      login: (event) => {
        localStorage.setItem('local_auth_token', event.email)
        window.location.href = '/'
      },
      signup: () => {
        console.log('unsure how to signup with passage')
        return { id: 'unique-user-id', email: '', roles: [] }
      },
    }
  } else if (process.env.AUTH_PROVIDER === 'passage') {
    client = {
      logout: async () => {
        return await getPassageUser().signOut()
      },
      getToken: async () => {
        console.log('getAuthToken')
        const token = await getPassageUser().getAuthToken()
        return token
      },
      getUserMetadata: async () => {
        console.log('passageUser.userInfo()')
        console.log(await getPassageUser().userInfo())
        return getPassageUser().userInfo()
      },
      login: (event) => {
        localStorage.setItem('psg_auth_token', event.auth_token)
        window.location.href = event.redirect_url
      },
      signup: () => {
        console.log('unsure how to signup with passage')
        return { id: 'unique-user-id', email: '', roles: [] }
      },
    }
  }

  const authImplementation = createAuthImplementation(client)

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
    type: process.env.AUTH_PROVIDER,
    client,
    login: async (e) => client.login(e),
    logout: async () => await client.logout(),
    signup: async () => client.signup(),
    getToken: async () => await client.getToken(),
    getUserMetadata: async () => await client.getUserMetadata(),
  }
}

export const { AuthProvider, useAuth } = createAuth()
