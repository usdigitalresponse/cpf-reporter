import type {
  EditReportingPeriodById,
  UpdateReportingPeriodInput,
} from 'types/graphql'

import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  CheckboxField,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormReportingPeriod = NonNullable<
  EditReportingPeriodById['reportingPeriod']
>

interface ReportingPeriodFormProps {
  reportingPeriod?: EditReportingPeriodById['reportingPeriod']
  onSave: (
    data: UpdateReportingPeriodInput,
    id?: FormReportingPeriod['id']
  ) => void
  error: RWGqlError
  loading: boolean
}

const ReportingPeriodForm = (props: ReportingPeriodFormProps) => {
  const onSubmit = (data: FormReportingPeriod) => {
    props.onSave(data, props?.reportingPeriod?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormReportingPeriod> onSubmit={onSubmit} error={props.error}>
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
          defaultValue={props.reportingPeriod?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="startDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start date
        </Label>

        <DatetimeLocalField
          name="startDate"
          defaultValue={formatDatetime(props.reportingPeriod?.startDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="startDate" className="rw-field-error" />

        <Label
          name="endDate"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End date
        </Label>

        <DatetimeLocalField
          name="endDate"
          defaultValue={formatDatetime(props.reportingPeriod?.endDate)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="endDate" className="rw-field-error" />

        <Label
          name="organizationId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Organization id
        </Label>

        <NumberField
          name="organizationId"
          defaultValue={props.reportingPeriod?.organizationId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="organizationId" className="rw-field-error" />

        <Label
          name="certifiedAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Certified at
        </Label>

        <DatetimeLocalField
          name="certifiedAt"
          defaultValue={formatDatetime(props.reportingPeriod?.certifiedAt)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="certifiedAt" className="rw-field-error" />

        <Label
          name="certifiedById"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Certified by id
        </Label>

        <NumberField
          name="certifiedById"
          defaultValue={props.reportingPeriod?.certifiedById}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="certifiedById" className="rw-field-error" />

        <Label
          name="inputTemplateId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Input template id
        </Label>

        <NumberField
          name="inputTemplateId"
          defaultValue={props.reportingPeriod?.inputTemplateId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="inputTemplateId" className="rw-field-error" />

        <Label
          name="outputTemplateId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Output template id
        </Label>

        <NumberField
          name="outputTemplateId"
          defaultValue={props.reportingPeriod?.outputTemplateId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="outputTemplateId" className="rw-field-error" />

        <Label
          name="isCurrentPeriod"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Is current period
        </Label>

        <CheckboxField
          name="isCurrentPeriod"
          defaultChecked={props.reportingPeriod?.isCurrentPeriod}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="isCurrentPeriod" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ReportingPeriodForm
