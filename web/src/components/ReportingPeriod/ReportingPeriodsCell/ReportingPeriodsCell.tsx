import type { FindReportingPeriods } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ReportingPeriods from 'src/components/ReportingPeriod/ReportingPeriods'

export const QUERY = gql`
  query FindReportingPeriods {
    reportingPeriods {
      id
      name
      startDate
      endDate
      organizationId
      inputTemplateId
      outputTemplateId
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No reportingPeriods yet. '}
      <Link to={routes.newReportingPeriod()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  reportingPeriods,
}: CellSuccessProps<FindReportingPeriods>) => {
  return <ReportingPeriods reportingPeriods={reportingPeriods} />
}
