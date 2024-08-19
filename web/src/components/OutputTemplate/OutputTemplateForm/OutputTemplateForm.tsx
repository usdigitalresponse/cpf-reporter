import type {
  EditOutputTemplateById,
  UpdateOutputTemplateInput,
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
  FileField,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormOutputTemplate = NonNullable<EditOutputTemplateById['outputTemplate']>

interface OutputTemplateFormProps {
  outputTemplate?: EditOutputTemplateById['outputTemplate']
  onSave: (
    data: UpdateOutputTemplateInput,
    id?: FormOutputTemplate['id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const OutputTemplateForm = (props: OutputTemplateFormProps) => {
  const onSubmit = (data: FormOutputTemplate) => {
    props.onSave(data, props?.outputTemplate?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormOutputTemplate> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.outputTemplate?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="version"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Version
        </Label>

        <TextField
          name="version"
          defaultValue={props.outputTemplate?.version}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="version" className="rw-field-error" />

        <Label
          name="effectiveDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Effective date
        </Label>

        <DatetimeLocalField
          name="effectiveDate"
          defaultValue={formatDatetime(props.outputTemplate?.effectiveDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="effectiveDate" className="rw-field-error" />

        <Label
          name="rulesGeneratedAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Rules generated at
        </Label>

        <DatetimeLocalField
          name="rulesGeneratedAt"
          defaultValue={formatDatetime(props.outputTemplate?.rulesGeneratedAt)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="rulesGeneratedAt" className="rw-field-error" />

        <Label
          name="fileCPF1A"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          CPF1ABroadbandInfrastructureTemplate
        </Label>
        <FileField
          name="fileCPF1A"
          validation={{ required: true }}
          accept=".xlsx"
          className="form-control mt-3"
        />

        <Label
          name="fileCPF1B"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          CPF1BDigitalConnectivityTechTemplate
        </Label>
        <FileField
          name="fileCPF1B"
          validation={{ required: true }}
          accept=".xlsx"
          className="form-control mt-3"
        />

        <Label
          name="fileCPF1C"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          CPF1CMultipurposeCommunityTemplate
        </Label>
        <FileField
          name="fileCPF1C"
          validation={{ required: true }}
          accept=".xlsx"
          className="form-control mt-3"
        />

        <Label
          name="fileSubrecipient"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          CPFSubrecipientTemplate
        </Label>
        <FileField
          name="fileSubrecipient"
          validation={{ required: true }}
          accept=".xlsx"
          className="form-control mt-3"
        />
        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default OutputTemplateForm
