import { SubmitHandler } from '@redwoodjs/forms'

import { users } from 'src/lib/seeds'

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

    const user: User | null = users.find(
      (u) => u.email === localStorage.getItem('local_auth_token')
    )

    return user
  },
  login: async (event) => {
    let token
    if (event.user === 'manual') {
      token = event.email
    } else {
      token = event.user
    }
    localStorage.setItem('local_auth_token', token)
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
