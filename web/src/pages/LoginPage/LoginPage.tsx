import '@passageidentity/passage-elements/passage-login'

import { useEffect, useRef } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const ref = useRef()
  const { isAuthenticated, currentUser, logOut, logIn } = useAuth()
  console.log('ref', ref)
  const beforeAuth = (email) => {
    console.log(email)
    return true
  }
  const onSuccess = (event: any) => {
    // console.log(`successfully authenticated. ${event}`)
    // console.log(event)
    // localStorage.setItem('psg_auth_token', event.auth_token)
    // window.location.href = event.redirect_url
    /* add user information into redwood auth context */
    logIn(event)
  }
  useEffect(() => {
    const { current } = ref
    current.foo = {}
    current.beforeAuth = beforeAuth
    current.onSuccess = onSuccess
    return () => {}
  })
  console.log('isAuthenticated', isAuthenticated)
  console.log('currentUser', currentUser)
  console.log('logout', logOut)

  return (
    <>
      <MetaTags title="Login" description="Login page" />
      <passage-login
        ref={ref}
        app-id={process.env.REACT_APP_PASSAGE_APP_ID}
      ></passage-login>
    </>
  )
}

export default LoginPage
