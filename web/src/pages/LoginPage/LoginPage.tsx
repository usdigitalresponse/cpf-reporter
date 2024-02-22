import {
  Form,
  EmailField,
  Submit,
  FieldError,
  Label,
  SelectField,
  SubmitHandler,
} from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { LoginEventInterface } from 'src/auth/localAuth'
import { users } from 'src/lib/seeds'

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
      <div>{process.env.AUTH_PROVIDER === 'local' ? localAuth : ''}</div>
    </>
  )
}

export default LoginPage
