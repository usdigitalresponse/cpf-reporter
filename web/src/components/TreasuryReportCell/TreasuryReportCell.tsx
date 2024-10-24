import { useCallback, useEffect } from 'react'
import type {
  FindTreasuryReportQuery,
  FindTreasuryReportQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
} from '@redwoodjs/web'
import Button from 'react-bootstrap/Button'

export const QUERY = gql`
  query downloadZippedTreasuryFile($organizationId: Int!, $currentReportingPeriodId: Int!) {
    downloadZippedTreasuryFile(organizationId: $organizationId, currentReportingPeriodId: $currentReportingPeriodId) {
      fileLink
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindTreasuryReportQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  downloadZippedTreasuryFile,
}: CellSuccessProps<FindTreasuryReportQuery>) => {
  const { fileLink } = downloadZippedTreasuryFile

  useEffect(() => {
    window.open(fileLink, '_blank').focus()
  }, [fileLink])

  const onClick = useCallback(() => {
    window.open(fileLink, '_blank').focus()
  }, [fileLink])

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary mb-3">Treasury Report</h2>
      </header>
      <div className="rw-segment-main">
        <Button onClick={onClick} className="rw-button">
          Download Treasury Report
        </Button>
      </div>
    </div>
  )
}
