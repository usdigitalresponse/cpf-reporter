import type { EditUploadById, UpdateUploadInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UploadForm from 'src/components/Upload/UploadForm'

export const QUERY = gql`
  query EditUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      uploadedById
      agencyId
      reportingPeriodId
      expenditureCategoryId
      createdAt
      updatedAt
    }
  }
`
const UPDATE_UPLOAD_MUTATION = gql`
  mutation UpdateUploadMutation($id: Int!, $input: UpdateUploadInput!) {
    updateUpload(id: $id, input: $input) {
      id
      filename
      uploadedById
      agencyId
      reportingPeriodId
      expenditureCategoryId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ upload }: CellSuccessProps<EditUploadById>) => {
  const [updateUpload, { loading, error }] = useMutation(
    UPDATE_UPLOAD_MUTATION,
    {
      onCompleted: () => {
        toast.success('Upload updated')
        navigate(routes.uploads())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateUploadInput,
    id: EditUploadById['upload']['id']
  ) => {
    updateUpload({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Upload {upload?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UploadForm
          upload={upload}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
