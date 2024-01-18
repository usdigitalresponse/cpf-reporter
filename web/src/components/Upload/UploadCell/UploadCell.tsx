import type { FindUploadById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Upload from 'src/components/Upload/Upload'

export const QUERY = gql`
  query FindUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      uploadedBy {
        name
      }
      agency {
        code
      }
      organizationId
      reportingPeriod {
        name
      }
      expenditureCategory {
        code
      }
      notes
      createdAt
      updatedAt
      validations {
        id
        uploadId
        agencyId
        organizationId
        inputTemplateId
        validationResults
        reviewedById
        reviewedAt
        reviewType
        createdAt
        updatedAt
      }
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
