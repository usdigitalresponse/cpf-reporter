import {
  Form,
  EmailField,
  Submit,
  FieldError,
  Label,
  SubmitHandler,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { LoginEventInterface } from 'src/auth/localAuth'

const LoginPage = () => {
  const { logIn } = useAuth()
  const onSuccess = (event: SubmitHandler<LoginEventInterface>) => {
    if (process.env.AUTH_PROVIDER === 'local') {
      logIn(event)
    } else {
      logIn()
    }
  }
  const localAuth = (
    <>
      <div className="rw-segment-main">
        <div className="row mb-3">
          <Form onSubmit={onSuccess}>
            <Label name="email" className="form-label col-sm-2 col-form-label">
              Email
            </Label>
            <div className="col-sm-6">
              <EmailField
                className="form-control"
                name="email"
                validation={{ required: true }}
              />
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
      <div>{process.env.AUTH_PROVIDER === 'local' ? localAuth : ''}</div>
    </>
  )
}

export default LoginPage
