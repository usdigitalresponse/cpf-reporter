import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import type { EditUploadById, UpdateUploadInput } from 'types/graphql'

import {
  Form,
  FileField,
  SelectField,
  // HiddenField,
  FormError,
  FieldError,
  Label,
  Submit,
  TextAreaField,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

// type FormUpload = NonNullable<EditUploadById['upload']>

interface UploadFormProps {
  upload?: EditUploadById['upload']
  onSave: (data: UpdateUploadInput) => void
  error: RWGqlError
  loading: boolean
}

const UploadForm = (props: UploadFormProps) => {
  const formMethods = useForm()

  const onSubmit = (data) => {
    data.filename = data.file[0].name
    data.agencyId = parseInt(data.agencyId)
    data.reportingPeriodId = parseInt(data.reportingPeriodId)
    // console.log(data)

    props.onSave({
      uploadedById: 1,
      agencyId: 1,
      notes: data.notes,
      filename: data.file[0].name,
      organizationId: 1,
      reportingPeriodId: data.reportingPeriodId,
      expenditureCategoryId: 1,
    })
  }

  const onReset = () => {
    console.log('resetting form...')
    formMethods.reset()
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormError
        error={props.error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />
      {/* <HiddenField name="uploadedBy">1</HiddenField> */}
      <Label
        name="reportingPeriodId"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Reporting Period
      </Label>
      <SelectField name="reportingPeriodId">
        <option value={1}>23Q3</option>
        <option value={2}>23Q4</option>
        <option value={3}>24Q1</option>
      </SelectField>
      <Label
        name="agencyId"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Agency Code
      </Label>
      <SelectField name="agencyId">
        <option value={1}>ABC123</option>
        <option value={2}>EXT</option>
        <option value={3}>MISC</option>
      </SelectField>
      <FileField name="file" validation={{ required: true }} />
      <FieldError name="file" className="rw-field-error" />
      <Label
        name="notes"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Notes
      </Label>
      <TextAreaField name="notes"></TextAreaField>
      <div className="rw-button-group">
        <Submit disabled={props.loading} className="rw-button rw-button-blue">
          Submit
        </Submit>
        <Button className="rw-button rw-button-red" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Form>
  )
}

export default UploadForm
