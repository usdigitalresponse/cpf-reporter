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
  const onSubmit = (data: FormAgency) => {
    props.onSave(data, props?.agency?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormAgency> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.agency?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="abbreviation"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Abbreviation
        </Label>

        <TextField
          name="abbreviation"
          defaultValue={props.agency?.abbreviation}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="abbreviation" className="rw-field-error" />

        <Label
          name="code"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Code
        </Label>

        <TextField
          name="code"
          defaultValue={props.agency?.code}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="code" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default AgencyForm
