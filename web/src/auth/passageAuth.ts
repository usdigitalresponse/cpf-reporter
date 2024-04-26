import {
  PassageUser,
  PassageUserInfo,
} from '@passageidentity/passage-elements/passage-user'

export interface AuthResult {
  redirect_url: string
  auth_token: string
  refresh_token?: string
  refresh_token_expiration?: number
}

export interface PassageAuthClient {
  login: (event: AuthResult) => void
  logout: () => Promise<void>
  signup: () => null
  getToken: () => Promise<string>
  getUserMetadata: () => Promise<PassageUserInfo | null>
}

async function getPassageUser(): Promise<PassageUser | null> {
  if (localStorage.getItem('psg_auth_token')) {
    return new PassageUser()
  } else {
    return null
  }
}

export const passageAuthClient = {
  logout: async () => {
    const user = await getPassageUser()
    user?.signOut()
    window.location.href = '/login'
  },
  getToken: async () => {
    const user = await getPassageUser()
    return user?.getAuthToken()
  },
  getUserMetadata: async () => {
    const user = await getPassageUser()
    return user?.userInfo()
  },
  login: (event) => {
    localStorage.setItem('psg_auth_token', event.auth_token)
    window.location.href = event.redirect_url
  },
  signup: () => {
    throw Error('Not implemented')
  },
}

export function createPassageAuthImplementation(client: PassageAuthClient) {
  return {
    type: 'passage',
    client,
    login: async (e: AuthResult) => client.login(e),
    logout: async () => client.logout(),
    signup: async () => client.signup(),
    getToken: async () => client.getToken(),
    getUserMetadata: async () => client.getUserMetadata(),
  }
}
