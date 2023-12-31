import type { FindUploadById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Upload from 'src/components/Upload/Upload'

export const QUERY = gql`
  query FindUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      uploadedById
      agencyId
      organizationId
      reportingPeriodId
      expenditureCategoryId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Upload not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ upload }: CellSuccessProps<FindUploadById>) => {
  return <Upload upload={upload} />
}
