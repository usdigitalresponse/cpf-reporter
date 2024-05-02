import { useEffect, useRef } from 'react'

import '@passageidentity/passage-elements/passage-login'
import { PassageElement } from '@passageidentity/passage-elements'

import {
  Form,
  EmailField,
  Submit,
  FieldError,
  Label,
  SelectField,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { users } from 'src/lib/seeds'

const LoginPage = () => {
  const ref = useRef<PassageElement>()
  const { logIn } = useAuth()

  const onSuccess = (event) => {
    logIn(event)
  }

  useEffect(() => {
    if (window.APP_CONFIG?.webConfigParams?.auth_provider === 'passage') {
      const { current } = ref
      current.onSuccess = onSuccess
      return () => {}
    }
  })

  const passageAuth = (
    <passage-login
      ref={ref}
      app-id={window.APP_CONFIG?.webConfigParams?.passage_app_id}
    />
  )

  const localAuth = (
    <>
      <div className="rw-segment-main">
        <div className="row mb-3">
          <Form onSubmit={onSuccess}>
            <FieldError
              name="email"
              className="error-message offset-2 invalid-feedback"
            />
            <Label name="email" className="form-label col-sm-2 col-form-label">
              Choose User to Login With
            </Label>
            <SelectField className="form-control" name="user">
              <option value="manual">Manually supplied user email below</option>
              {users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </SelectField>
            <br></br>
            <br></br>
            <p>Either select a user above or provide an email below.</p>
            <p>
              Note: If you supply a user email then ensure that it exists in the
              database.
            </p>
            <br></br>
            <Label name="email" className="form-label col-sm-2 col-form-label">
              Email
            </Label>
            <div className="col-sm-6">
              <EmailField className="form-control" name="email" />
            </div>
            <br></br>
            <br></br>
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
        {window.APP_CONFIG?.webConfigParams?.auth_provider === 'local' ||
        process.env.AUTH_PROVIDER === 'local'
          ? localAuth
          : ''}
        {window.APP_CONFIG?.webConfigParams?.auth_provider === 'passage'
          ? passageAuth
          : ''}
      </div>
    </>
  )
}

export default LoginPage
