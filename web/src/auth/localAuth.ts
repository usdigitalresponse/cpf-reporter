import { SubmitHandler } from '@redwoodjs/forms'

// If you're integrating with an auth service provider you should delete this interface.
// Instead you should import the type from their auth client sdk.
export interface AuthClient {
  login: () => User
  logout: () => void
  signup: () => User
  getToken: () => string
  getUserMetadata: () => User | null
}

export interface LoginEventInterface {
  email: string
}

export interface LocalAuthClient {
  login: (event: SubmitHandler<LoginEventInterface>) => void
  logout: () => Promise<void>
  signup: () => null
  getToken: () => Promise<string>
  getUserMetadata: () => Promise<User | null>
}

interface User {
  id: string
  name: string
  email: string
  role: string
  agencyId: number
  organizationId: number
  createdAt: string
  updatedAt: string
}

export const localAuthClient = {
  logout: async () => {
    localStorage.removeItem('local_auth_token')
    window.location.href = '/login'
  },
  getToken: async () => {
    return localStorage.getItem('local_auth_token')
  },
  getUserMetadata: async () => {
    if (!localStorage.getItem('local_auth_token')) {
      return null
    }

    console.log('local: getUserMetadata')
    let user: User | null = null
    // Explicitly setting the url to ensure these requests are not made outside of the local environment
    await fetch(`http://localhost:8911/localAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authMethod: 'getUserMetadata',
        email: localStorage.getItem('local_auth_token'),
      }),
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
        return Promise.reject(response)
      })
      .then((jsonData: User) => {
        user = jsonData
      })
      .catch((error) => {
        console.log(error.status)
        throw new Error('Error getting user metadata')
      })
    return user
  },
  login: async (event) => {
    await fetch(`http://localhost:8911/localAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authMethod: 'login',
        email: event.email,
      }),
    })
      .then((response: Response) => {
        if (response.ok) {
          return response.json()
        }
        return Promise.reject(response)
      })
      .catch((error) => {
        console.log(error.status)
        throw new Error('Error getting user metadata')
      })

    localStorage.setItem('local_auth_token', event.email)
    window.location.href = '/'
  },
  signup: () => {
    console.log('implemented via GraphQL directly from the user creation page')
    return null
  },
}

export function createLocalAuthImplementation(client: LocalAuthClient) {
  return {
    type: 'local',
    client,
    login: async (e: SubmitHandler<LoginEventInterface>) => client.login(e),
    logout: async () => client.logout(),
    signup: async () => client.signup(),
    getToken: async () => client.getToken(),
    getUserMetadata: async () => client.getUserMetadata(),
  }
}
