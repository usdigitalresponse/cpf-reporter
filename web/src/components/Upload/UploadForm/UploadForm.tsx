import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import type {
  CreateUploadMutation,
  CreateUploadMutationVariables,
  EditUploadById,
} from 'types/graphql'

import {
  Form,
  FileField,
  FormError,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OrganizationPickListsCell from 'src/components/Organization/OrganizationPickListsCell'

const FILE_SIZE_THRESHOLD = 5 * 1048576 // 5 MB in bytes

const CREATE_UPLOAD = gql`
  mutation CreateUploadMutation($input: CreateUploadInput!) {
    createUpload(input: $input) {
      id
      signedUrl
      validations {
        id
        passed
        initiatedById
        results
      }
    }
  }
`
// type FormUpload = NonNullable<EditUploadById['upload']>

interface UploadFormProps {
  upload?: EditUploadById['upload']
  error: RWGqlError
  loading: boolean
}

const UploadForm = ({ error, loading }: UploadFormProps) => {
  const formMethods = useForm()

  const [create] = useMutation<
    CreateUploadMutation,
    CreateUploadMutationVariables
  >(CREATE_UPLOAD, {
    onCompleted: ({ createUpload }) => {
      toast.success('Upload created')
      navigate(routes.upload({ id: createUpload?.id }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (data) => {
    if (data.file[0].size > FILE_SIZE_THRESHOLD) {
      toast.error('Upload should not be larger than 5MB')
      return
    }

    data.filename = data.file[0].name
    data.agencyId = parseInt(data.agencyId)
    data.reportingPeriodId = parseInt(data.reportingPeriodId)

    const uploadInput = {
      agencyId: data.agencyId,
      filename: data.file[0].name,
      reportingPeriodId: data.reportingPeriodId,
    }
    const res = await create({ variables: { input: uploadInput } })
    const formData = new FormData()
    formData.append('file', data.file[0])
    res.data?.createUpload?.signedUrl &&
      fetch(res.data?.createUpload?.signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': data.file[0].type,
          'x-amz-server-side-encryption': 'AES256',
        },
        body: data.file[0],
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
        error={error}
        wrapperClassName="rw-form-error-wrapper"
        titleClassName="rw-form-error-title"
        listClassName="rw-form-error-list"
      />
      <div className="col-md-8">
        <OrganizationPickListsCell />
        <FileField
          name="file"
          validation={{ required: true }}
          accept=".xlsm"
          className="form-control mt-3"
        />
        <FieldError name="file" className="rw-field-error" />
      </div>
      <div className="rw-button-group pt-2">
        <Submit disabled={loading} className="btn btn-primary me-2">
          Submit
        </Submit>
        <Button className="btn btn-danger me-2" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Form>
  )
}

export default UploadForm
