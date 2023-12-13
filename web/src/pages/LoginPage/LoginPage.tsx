import { useEffect, useRef } from 'react'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import '@passageidentity/passage-elements/passage-login'

const LoginPage = () => {
  const ref = useRef()
  const beforeAuth = (email) => {
    console.log(email)
    return true
  }
  const onSuccess = (event: any) => {
    console.log(`successfully authenticated. ${event}`)
    console.log(event)
    localStorage.setItem('psg_auth_token', event.auth_token)
    window.location.href = event.redirect_url
  }
  useEffect(() => {
    const { current } = ref
    current.beforeAuth = beforeAuth
    current.onSuccess = onSuccess
    return () => {}
  })
  // const beforeAuth = (event: any) => { console.log('before auth') }
  return (
    <>
      <MetaTags title="Login" description="Login page" />

      <h1>LoginPage</h1>
      <p>
        Find me in <code>./web/src/pages/LoginPage/LoginPage.tsx</code>
      </p>
      <p>
        My default route is named <code>login</code>, link to me with `
        <Link to={routes.login()}>Login</Link>`
      </p>
      <passage-login
        ref={ref}
        app-id={process.env.REACT_APP_PASSAGE_APP_ID}
        default-country-code="us"
        on-success={(event: any) => {
          console.log('foo')
        }}
      ></passage-login>
    </>
  )
}

export default LoginPage
