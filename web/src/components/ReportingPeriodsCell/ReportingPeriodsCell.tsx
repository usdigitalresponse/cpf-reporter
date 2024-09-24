import type { FindReportingPeriods } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ReportingPeriods from 'src/components/ReportingPeriod/ReportingPeriods'

// TODO: Add missing information about reporting period certifications
export const QUERY = gql`
  query FindReportingPeriods {
    reportingPeriods {
      id
      name
      startDate
      endDate
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  reportingPeriods,
}: CellSuccessProps<FindReportingPeriods>) => {
  return <ReportingPeriods reportingPeriods={reportingPeriods} />
}
