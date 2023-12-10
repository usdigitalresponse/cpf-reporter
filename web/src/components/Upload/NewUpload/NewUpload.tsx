import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UploadForm from 'src/components/Upload/UploadForm'

import type { CreateUploadInput } from 'types/graphql'

const CREATE_UPLOAD_MUTATION = gql`
  mutation CreateUploadMutation($input: CreateUploadInput!) {
    createUpload(input: $input) {
      id
    }
  }
`

const NewUpload = () => {
  const [createUpload, { loading, error }] = useMutation(
    CREATE_UPLOAD_MUTATION,
    {
      onCompleted: () => {
        toast.success('Upload created')
        navigate(routes.uploads())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateUploadInput) => {
    createUpload({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Upload</h2>
      </header>
      <div className="rw-segment-main">
        <UploadForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUpload
