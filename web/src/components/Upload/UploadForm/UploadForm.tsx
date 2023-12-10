import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

import type { EditUploadById, UpdateUploadInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

type FormUpload = NonNullable<EditUploadById['upload']>

interface UploadFormProps {
  upload?: EditUploadById['upload']
  onSave: (data: UpdateUploadInput, id?: FormUpload['id']) => void
  error: RWGqlError
  loading: boolean
}

const UploadForm = (props: UploadFormProps) => {
  const onSubmit = (data: FormUpload) => {
    props.onSave(data, props?.upload?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormUpload> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="filename"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Filename
        </Label>

        <TextField
          name="filename"
          defaultValue={props.upload?.filename}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="filename" className="rw-field-error" />

        <Label
          name="uploadedById"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Uploaded by id
        </Label>

        <NumberField
          name="uploadedById"
          defaultValue={props.upload?.uploadedById}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="uploadedById" className="rw-field-error" />

        <Label
          name="agencyId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Agency id
        </Label>

        <NumberField
          name="agencyId"
          defaultValue={props.upload?.agencyId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="agencyId" className="rw-field-error" />

        <Label
          name="organizationId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Organization id
        </Label>

        <NumberField
          name="organizationId"
          defaultValue={props.upload?.organizationId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="organizationId" className="rw-field-error" />

        <Label
          name="reportingPeriodId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Reporting period id
        </Label>

        <NumberField
          name="reportingPeriodId"
          defaultValue={props.upload?.reportingPeriodId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="reportingPeriodId" className="rw-field-error" />

        <Label
          name="expenditureCategoryId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expenditure category id
        </Label>

        <NumberField
          name="expenditureCategoryId"
          defaultValue={props.upload?.expenditureCategoryId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="expenditureCategoryId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UploadForm
