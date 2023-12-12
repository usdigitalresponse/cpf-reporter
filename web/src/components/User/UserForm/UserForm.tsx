import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'
import type { EditUserById, UpdateUserInput } from 'types/graphql'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

type FormUser = NonNullable<EditUserById['user']>

interface UserFormProps {
  user?: EditUserById['user']
  onSave: (data: UpdateUserInput, id?: FormUser['id']) => void
  error: RWGqlError
  loading: boolean
}

const UserForm = (props: UserFormProps) => {
  const { user, onSave, error, loading } = props
  const formMethods: UseFormReturn<FormUser> = useForm<FormUser>()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  // Resets the form to the previous values when editing the existing user
  // Clears out the form when creating a new user
  const onReset = () => {
    formMethods.reset()
  }
  const onSubmit = (data: FormUser) => {
    onSave(data, props?.user?.id)
  }

  return (
    <Form<FormUser>
      onSubmit={onSubmit}
      formMethods={formMethods}
      error={error}
      className={hasErrors ? 'was-validated' : ''}
    >
      {user && (
        <div className="row">
          <Label name="id" className="form-label col-sm-2 col-form-label">
            Agency Code
          </Label>
          <div className="col-sm-2">
            <TextField
              name="id"
              defaultValue={user?.id}
              className="form-control mb-3 col-auto"
              disabled
            />
          </div>
        </div>
      )}

      <FormError
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />

      <div className="row mb-3">
        <Label name="email" className="form-label col-sm-2 col-form-label">
          Email
        </Label>

        <div className="col-sm-6">
          <TextField
            name="email"
            defaultValue={props.user?.email}
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>

        <FieldError
          name="email"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="name" className="form-label col-sm-2 col-form-label">
          Name
        </Label>

        <div className="col-sm-6">
          <TextField
            name="name"
            defaultValue={props.user?.name}
            className="form-control"
            errorClassName="form-control is-invalid"
          />
        </div>

        <FieldError
          name="name"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="role" className="form-label col-sm-2 col-form-label">
          Role
        </Label>

        <div className="col-sm-6">
          <NumberField
            name="roleId"
            defaultValue={props.user?.roleId}
            className="form-control"
            errorClassName="form-control is-invalid"
            emptyAs={'undefined'}
          />
        </div>

        <FieldError
          name="role"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="agencyId" className="form-label col-sm-2 col-form-label">
          Agency id
        </Label>

        <div className="col-sm-6">
          <NumberField
            name="agencyId"
            defaultValue={props.user?.agencyId}
            className="form-control"
            errorClassName="form-control is-invalid"
            emptyAs={'undefined'}
          />
        </div>

        <FieldError
          name="agencyId"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label
          name="organizationId"
          className="form-label col-sm-2 col-form-label"
        >
          Organization id
        </Label>

        <div className="col-sm-6">
          <NumberField
            name="organizationId"
            defaultValue={props.user?.organizationId}
            className="form-control"
            errorClassName="form-control is-invalid"
            emptyAs={'undefined'}
          />
        </div>

        <FieldError
          name="organizationId"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row">
        <div className="offset-2 col-sm-6">
          <Submit disabled={loading} className="btn btn-primary me-2">
            Save
          </Submit>
          <Button onClick={onReset} className="btn btn-secondary">
            Reset
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default UserForm
