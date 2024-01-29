import type { FindUploadById } from 'types/graphql'
import { useQuery } from '@redwoodjs/web'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Upload from 'src/components/Upload/Upload'

export const QUERY = gql`
  query FindUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      uploadedBy {
        name
        organizationId
      }
      agency {
        id
        code
      }
      organizationId
      reportingPeriod {
        id
        name
      }
      expenditureCategory {
        code
      }
      notes
      createdAt
      updatedAt
      latestValidation {
        agencyId
        organizationId
        inputTemplateId
        reviewResults
        reviewedBy {
          name
        }
        reviewType
        createdAt
      }
    }
  }
`

// !It might be better to get inputTemplateId on the backend when creating a new UploadValidation
const GET_INPUT_TEMPLATE_ID = gql`
  query inputTemplateForReportingPeriodQuery($reportingPeriodId: Int!) {
    inputTemplateForReportingPeriod(reportingPeriodId: $reportingPeriodId) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Upload not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ upload }: CellSuccessProps<FindUploadById>) => {
  const { refetch } = useQuery(QUERY, { variables: { id: upload.id } })

  return <Upload upload={upload} refetchUpload={refetch} />
}
