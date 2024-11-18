import { useState } from 'react'

import type { FindUploads } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'

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
      reportingPeriod {
        id
        name
      }
      latestValidation {
        id
        createdAt
        passed
        isManual
        results
      }
      createdAt
      updatedAt
    }
  }
`

export const VALID_UPLOADS_QUERY = gql`
  query GetValidUploadsInCurrentPeriod {
    getValidUploadsInCurrentPeriod {
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
      reportingPeriod {
        id
        name
      }
      latestValidation {
        id
        createdAt
        passed
        isManual
        results
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
  const [showTreasuryFiles, setShowTreasuryFiles] = useState(false)
  const { data: validUploadsData, loading: validUploadsLoading } = useQuery(
    VALID_UPLOADS_QUERY,
    {
      skip: !showTreasuryFiles,
    }
  )

  const displayedUploads =
    showTreasuryFiles && validUploadsData
      ? validUploadsData.getValidUploadsInCurrentPeriod
      : uploads

  return (
    <Uploads
      uploads={displayedUploads}
      showTreasuryFiles={showTreasuryFiles}
      onTreasuryFilesChange={() => setShowTreasuryFiles(!showTreasuryFiles)}
      isLoading={validUploadsLoading}
    />
  )
}
