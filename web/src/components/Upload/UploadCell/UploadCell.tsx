import type { FindUploadById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Upload from 'src/components/Upload/Upload'

export const QUERY = gql`
  query FindUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      agency {
        code
      }
      expenditureCategory {
        code
      }
      reportingPeriod {
        name
      }
      uploadedBy {
        id
        name
      }
      latestValidation {
        id
        passed
        isManual
        results
        createdAt
        initiatedBy {
          name
        }
      }
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

export const beforeQuery = (props: { id: number }) => {
  return {
    variables: props,
    fetchPolicy: 'no-cache',
  }
}

export const Success = ({
  upload,
  queryResult,
}: CellSuccessProps<FindUploadById>) => {
  return <Upload upload={upload} queryResult={queryResult} />
}
