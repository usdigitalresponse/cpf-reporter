import '@passageidentity/passage-elements/passage-login'

import { useEffect, useRef } from 'react'

import {
  useForm,
  useFormContext,
  Form,
  EmailField,
  Submit,
  FieldError,
  Label,
  /**
   * Or anything else React Hook Form exports!
   *
   * @see {@link https://react-hook-form.com/api}
   */
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const ref = useRef()
  const { isAuthenticated, currentUser, logIn } = useAuth()
  console.log('ref', ref)
  const beforeAuth = (email) => {
    console.log('beforeauth', email)
    return true
  }
  const onSuccess = (event: any) => {
    logIn(event)
  }
  useEffect(() => {
    if (process.env.AUTH_PROVIDER === 'passage') {
      const { current } = ref
      current.foo = {}
      current.beforeAuth = beforeAuth
      current.onSuccess = onSuccess
      return () => {}
    }
  })
  console.log('isAuthenticated', isAuthenticated)
  console.log('currentUser', currentUser)
  // console.log('logout', logOut)

  const passageAuth = (
    <>
      <passage-login
        ref={ref}
        app-id={process.env.REACT_APP_PASSAGE_APP_ID}
      ></passage-login>
    </>
  )

  const localAuth = (
    <>
      <div className="rw-segment-main">
        <div className="row mb-3">
          <Form onSubmit={onSuccess}>
            <Label name="email" className="form-label col-sm-2 col-form-label">
              Email
            </Label>
            <div className="col-sm-6">
              <EmailField className="form-control" name="email" />
            </div>
            <FieldError
              name="email"
              className="error-message offset-2 invalid-feedback"
            />
            <Submit className="btn btn-primary me-2">Login</Submit>
          </Form>
        </div>
      </div>
    </>
  )

  return (
    <>
      <MetaTags title="Login" description="Login page" />
      <div>
        {process.env.AUTH_PROVIDER === 'local' ? localAuth : passageAuth}
      </div>
    </>
  )
}

export default LoginPage
