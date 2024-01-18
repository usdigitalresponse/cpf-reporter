import type { FindReportingPeriodById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ReportingPeriod from 'src/components/ReportingPeriod/ReportingPeriod'

export const QUERY = gql`
  query FindReportingPeriodById($id: Int!) {
    reportingPeriod: reportingPeriod(id: $id) {
      id
      name
      startDate
      endDate
      organizationId
      certifiedAt
      certifiedById
      inputTemplateId
      outputTemplateId
      isCurrentPeriod
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>ReportingPeriod not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  reportingPeriod,
}: CellSuccessProps<FindReportingPeriodById>) => {
  return <ReportingPeriod reportingPeriod={reportingPeriod} />
}
