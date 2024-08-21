import { ROLES } from 'api/src/lib/constants'
import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'
import type { EditUserById, UpdateUserInput } from 'types/graphql'
import { useAuth } from 'web/src/auth'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  SelectField,
  Submit,
  Controller,
} from '@redwoodjs/forms'
import { useQuery } from '@redwoodjs/web'

type FormUser = NonNullable<EditUserById['user']>

interface UserFormProps {
  user?: EditUserById['user']
  onSave: (data: UpdateUserInput, id?: FormUser['id']) => void
  error: RWGqlError
  loading: boolean
}

const GET_AGENCIES_UNDER_USER_ORGANIZATION = gql`
  query agenciesUnderUserOrganization($organizationId: Int!) {
    agenciesByOrganization(organizationId: $organizationId) {
      id
      name
    }
  }
`

const UserForm = (props: UserFormProps) => {
  const { hasRole, currentUser } = useAuth()

  const { user, onSave, error, loading } = props
  const formMethods: UseFormReturn<FormUser> = useForm<FormUser>()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  const {
    loading: agenciesLoading,
    error: agenciesError,
    data: agenciesData,
  } = useQuery(GET_AGENCIES_UNDER_USER_ORGANIZATION, {
    variables: { organizationId: currentUser.agency.organizationId },
  })
  const agencies = agenciesData?.agenciesByOrganization

  // Resets the form to the previous values when editing the existing user
  // Clears out the form when creating a new user
  const onReset = () => {
    formMethods.reset()
  }

  const onSubmit = (data: FormUser) => {
    onSave(data, props?.user?.id)
  }

  if (agenciesLoading) return <div>Loading...</div>
  if (agenciesError) return <div>Couldn&apos;t load agencies</div>

  return (
    <Form<FormUser>
      onSubmit={onSubmit}
      formMethods={formMethods}
      error={error}
      className={hasErrors ? 'was-validated' : ''}
    >
      <FormError
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />
      {user && (
        <div className="row">
          <Label
            name="createdAt"
            className="form-label col-sm-2 col-form-label"
          >
            Created:
          </Label>
          <div className="col-sm-6">
            <TextField
              name="createdAt"
              defaultValue={user?.createdAt}
              className="form-control mb-3 col-auto"
              disabled
            />
          </div>
        </div>
      )}

      {user && (
        <div className="row">
          <Label name="id" className="form-label col-sm-2 col-form-label">
            ID
          </Label>
          <div className="col-sm-6">
            <TextField
              name="id"
              defaultValue={user?.id}
              className="form-control mb-3 col-auto"
              disabled
            />
          </div>
        </div>
      )}

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
            validation={{ required: 'This field is required' }}
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
          <SelectField
            name="role"
            defaultValue={user?.role}
            className="form-select"
          >
            {hasRole(ROLES.USDR_ADMIN) && (
              <option value={ROLES.USDR_ADMIN}>USDR admin</option>
            )}
            <option value={ROLES.ORGANIZATION_ADMIN}>Organization admin</option>
            <option value={ROLES.ORGANIZATION_STAFF}>Organization staff</option>
          </SelectField>
        </div>

        <FieldError
          name="role"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="agencyId" className="form-label col-sm-2 col-form-label">
          Agency
        </Label>

        <div className="col-sm-6">
          <SelectField
            name="agencyId"
            className="form-select"
            validation={{
              required: 'This field is required',
              valueAsNumber: true,
            }}
            emptyAs={null}
            defaultValue={user?.agencyId}
            errorClassName="form-select is-invalid"
          >
            <option value="" hidden>
              Select an agency
            </option>
            {agencies?.map((agency) => (
              <option key={agency.id} value={parseInt(agency.id)}>
                {agency.name}
              </option>
            ))}
          </SelectField>
        </div>

        <FieldError
          name="agencyId"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label className="form-label col-sm-2 col-form-label">Status</Label>

        <div className="col-sm-6 d-flex align-items-center">
          <Controller
            name="isActive"
            control={formMethods.control}
            defaultValue={user ? user.isActive : true}
            disabled={!hasRole(ROLES.ORGANIZATION_ADMIN) || !user}
            render={({ field: { onChange, name, value, ref, disabled } }) => (
              <>
                <div className="form-check form-check-inline">
                  <input
                    name={name}
                    type="radio"
                    id="userIsActive"
                    className="form-check-input"
                    defaultChecked={value}
                    disabled={disabled}
                    onChange={() => onChange(true)}
                    ref={ref}
                  />
                  <Label name="userIsActive" className="form-check-label">
                    Active
                  </Label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    name={name}
                    type="radio"
                    id="userIsInactive"
                    className="form-check-input"
                    defaultChecked={!value}
                    disabled={disabled}
                    onChange={() => onChange(false)}
                    ref={ref}
                  />
                  <Label name="userIsInactive" className="form-check-label">
                    Inactive
                  </Label>
                </div>
              </>
            )}
          />
        </div>
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
