import type { FindUploads } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Uploads from 'src/components/Upload/Uploads'

export const QUERY = gql`
  query FindUploads {
    uploads {
      id
      filename
      uploadedBy {
        id
        email
      }
      agency {
        id
        code
      }
      expenditureCategory {
        id
        code
      }
      latestValidation {
        createdAt
        invalidatedAt
        validatedAt
      }
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No uploads yet. '}
      <Link to={routes.newUpload()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ uploads }: CellSuccessProps<FindUploads>) => {
  return <Uploads uploads={uploads} />
}
