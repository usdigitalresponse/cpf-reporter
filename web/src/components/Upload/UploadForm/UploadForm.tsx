import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import type { EditUploadById } from 'types/graphql'

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
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_UPLOAD = gql`
  mutation CreateUploadMutation($input: CreateUploadInput!) {
    createUpload(input: $input) {
      id
      signedUrl
    }
  }
`
// type FormUpload = NonNullable<EditUploadById['upload']>

interface UploadFormProps {
  upload?: EditUploadById['upload']
  error: RWGqlError
  loading: boolean
}

const UploadForm = (props: UploadFormProps) => {
  const formMethods = useForm()

  const [create] = useMutation<
    CreateUploadMutation,
    CreateUploadMutationVariables
  >(CREATE_UPLOAD, {
    onCompleted: () => {
      toast.success('Upload created')
      navigate(routes.uploads())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data) => {
    data.filename = data.file[0].name
    data.agencyId = parseInt(data.agencyId)
    data.reportingPeriodId = parseInt(data.reportingPeriodId)

    const uploadInput = {
      uploadedById: 1,
      agencyId: 1,
      notes: data.notes,
      filename: data.file[0].name,
      organizationId: 1,
      reportingPeriodId: data.reportingPeriodId,
      expenditureCategoryId: 1,
    }
    const res = await create({ variables: { input: uploadInput } })
    const formData = new FormData()
    formData.append('file', data.file[0])
    fetch(res.data?.createUpload?.signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': data.file[0].type,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
      })
      .then((responseData) => {
        console.log('File upload successful. Response:', responseData)
      })
      .catch((error) => {
        console.error('Error uploading file:', error)
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
