import { Button } from 'react-bootstrap'
import { useForm, UseFormReturn } from 'react-hook-form'

import { Form, Label, TextAreaField, Submit } from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

interface CreateNewTreasuryGenerationInput {
  payload: string
}

interface NewOrganizationFormProps {
  onSave: (data: CreateNewTreasuryGenerationInput) => void
  error: RWGqlError
  loading: boolean
}

/* 
  This form collects any payload information to kick-off a lambda function to generate a treasury file.
*/
const NewTreasuryGenerationForm = (props: NewOrganizationFormProps) => {
  const { onSave, error, loading } = props
  const formMethods: UseFormReturn = useForm()
  const hasErrors = Object.keys(formMethods.formState.errors).length > 0

  const onReset = () => {
    formMethods.reset()
  }

  return (
    <Form
      onSubmit={({ payload }) => onSave({ payload })}
      formMethods={formMethods}
      error={error}
      className={hasErrors ? 'was-validated' : ''}
    >
      <Label
        name="payload"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Generation Payload
      </Label>

      <TextAreaField
        name="payload"
        className="rw-input"
        errorClassName="rw-input rw-input-error"
        rows={5}
      />
      <br />
      <div className="row">
        <div className="offset-3 col-sm-6">
          <Submit disabled={loading} className="btn btn-primary me-2">
            Kick-off File Generation
          </Submit>
          <Button onClick={onReset} className="btn btn-secondary">
            Reset
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default NewTreasuryGenerationForm
