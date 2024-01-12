import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'
import type {
  EditOrganizationById,
  UpdateOrganizationInput,
} from 'types/graphql'

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

interface EditOrganizationFormProps {
  organization?: EditOrganizationById['organization']
  onSave: (data: UpdateOrganizationInput, id?: FormOrganization['id']) => void
  error: RWGqlError
  loading: boolean
}

const EditOrganizationForm = (props: EditOrganizationFormProps) => {
  const { organization, error, loading } = props
  const formMethods: UseFormReturn<FormOrganization> =
    useForm<FormOrganization>()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  const onReset = () => {
    formMethods.reset()
  }

  const onSubmit = (data: FormOrganization) => {
    props.onSave(data, props?.organization?.id)
  }

  return (
    <Form<FormOrganization>
      onSubmit={onSubmit}
      formMethods={formMethods}
      error={error}
      className={hasErrors ? 'was-validated' : ''}
    >
      {organization && (
        <div className="row">
          <Label name="id" className="form-label col-sm-2 col-form-label">
            Organization Id
          </Label>
          <div className="col-sm-2">
            <TextField
              name="id"
              defaultValue={organization?.id}
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
        <Label name="name" className="form-label col-sm-2 col-form-label">
          Organization Name
        </Label>
        <div className="col-sm-6">
          <TextField
            name="name"
            defaultValue={organization?.name}
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

export default EditOrganizationForm
