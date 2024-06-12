import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UploadForm from 'src/components/Upload/UploadForm'

const CREATE_UPLOAD_MUTATION = gql`
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

const NewUpload = () => {
  const [_, { loading, error }] = useMutation<
    CreateUploadMutation,
    CreateUploadMutationVariables
  >(CREATE_UPLOAD_MUTATION, {
    onCompleted: ({ createUpload }) => {
      toast.success('Upload created')
      navigate(routes.upload({ id: createUpload?.id }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Submit Workbook</h2>
      </header>
      <div className="rw-segment-main">
        <UploadForm
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewUpload
