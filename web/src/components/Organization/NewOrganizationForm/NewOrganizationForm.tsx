import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'
import type { EditOrganizationById } from 'types/graphql'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

type FormOrganization = NonNullable<EditOrganizationById['organization']>

interface AddOrganizationFormProps {
  organization?: EditOrganizationById['organization']
  onSave: (data: any, id?: FormOrganization['id']) => void
  error: RWGqlError
  loading: boolean
}

/* 
  This form creates a new organization, a new agency assigned to that organization, 
  and a new admin user assigned to that agency.
*/
const NewOrganizationForm = (props: AddOrganizationFormProps) => {
  const { onSave, error, loading } = props
  const formMethods: UseFormReturn = useForm()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  const onReset = () => {
    formMethods.reset()
  }

  const onSubmit = (data) => {
    const {
      organizationName,
      agencyName,
      agencyAbbreviation,
      agencyCode,
      userEmail,
      userName,
    } = data

    onSave({
      organizationName,
      agencyName,
      agencyAbbreviation,
      agencyCode,
      userEmail,
      userName,
    })
  }

  return (
    <Form
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
      <div className="row mb-3">
        <Label
          name="organizationName"
          className="form-label col-sm-3 col-form-label"
        >
          Organization Name
        </Label>
        <div className="col-sm-6">
          <TextField
            name="organizationName"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="organizationName"
          className="error-message offset-3 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="agencyName" className="form-label col-sm-3 col-form-label">
          Team Name
        </Label>
        <div className="col-sm-6">
          <TextField
            name="agencyName"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="agencyName"
          className="error-message offset-3 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label
          name="agencyAbbreviation"
          className="form-label col-sm-3 col-form-label"
        >
          Team Abbreviation
        </Label>
        <div className="col-sm-6">
          <TextField
            name="agencyAbbreviation"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="agencyAbbreviation"
          className="error-message offset-3 invalid-feedback"
        />
      </div>
      <div className="row mb-3">
        <Label name="agencyCode" className="form-label col-sm-3 col-form-label">
          Agency Code
        </Label>
        <div className="col-sm-6">
          <TextField
            name="agencyCode"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="agencyCode"
          className="error-message offset-3 invalid-feedback"
        />
      </div>
      <div className="row mb-3">
        <Label name="userEmail" className="form-label col-sm-3 col-form-label">
          Admin Email
        </Label>
        <div className="col-sm-6">
          <TextField
            name="userEmail"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="userEmail"
          className="error-message offset-3 invalid-feedback"
        />
      </div>
      <div className="row mb-3">
        <Label name="userName" className="form-label col-sm-3 col-form-label">
          Admin User Name
        </Label>
        <div className="col-sm-6">
          <TextField
            name="userName"
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>
        <FieldError
          name="userName"
          className="error-message offset-3 invalid-feedback"
        />
      </div>

      <div className="row">
        <div className="offset-3 col-sm-6">
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

export default NewOrganizationForm
