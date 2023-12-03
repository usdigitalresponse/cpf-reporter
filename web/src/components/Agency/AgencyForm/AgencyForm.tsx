import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'
import type { EditAgencyById, UpdateAgencyInput } from 'types/graphql'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

type FormAgency = NonNullable<EditAgencyById['agency']>

interface AgencyFormProps {
  agency?: EditAgencyById['agency']
  onSave: (data: UpdateAgencyInput, id?: FormAgency['id']) => void
  error: RWGqlError
  loading: boolean
}

const AgencyForm = (props: AgencyFormProps) => {
  const { agency, onSave, error, loading } = props
  const formMethods: UseFormReturn<FormAgency> = useForm<FormAgency>()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  // Resets the form to the previous values when editing the existing agency
  // Clears out the form when creating a new agency
  const onReset = () => {
    formMethods.reset()
  }

  const onSubmit = (data: FormAgency) => {
    onSave(data, props?.agency?.id)
  }

  return (
    <Form<FormAgency>
      onSubmit={onSubmit}
      formMethods={formMethods}
      error={error}
      className={hasErrors ? 'was-validated' : ''}
    >
      {agency && (
        <div className="row">
          <Label name="id" className="form-label col-sm-2 col-form-label">
            Agency Code
          </Label>
          <div className="col-sm-2">
            <TextField
              name="id"
              defaultValue={agency?.id}
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
        <Label name="code" className="form-label col-sm-2 col-form-label">
          Agency Code
        </Label>

        <div className="col-sm-6">
          <TextField
            name="code"
            defaultValue={agency?.code}
            className="form-control"
            errorClassName="form-control is-invalid"
            validation={{ required: 'This field is required' }}
          />
        </div>

        <FieldError
          name="code"
          className="error-message offset-2 invalid-feedback"
        />
      </div>

      <div className="row mb-3">
        <Label name="name" className="form-label col-sm-2 col-form-label">
          Agency Name
        </Label>

        <div className="col-sm-6">
          <TextField
            name="name"
            defaultValue={agency?.name}
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

export default AgencyForm
