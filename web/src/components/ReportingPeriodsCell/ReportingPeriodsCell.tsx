import type { FindReportingPeriodsWithCertification } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import ReportingPeriods from 'src/components/ReportingPeriod/ReportingPeriods'

export const QUERY = gql`
  query FindReportingPeriodsWithCertification {
    reportingPeriodsWithCertification {
      id
      name
      startDate
      endDate
      certificationForOrganization {
        createdAt
        certifiedBy {
          email
        }
      }
    }
    organizationOfCurrentUser {
      id
      preferences
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  reportingPeriodsWithCertification,
  organizationOfCurrentUser,
}: CellSuccessProps<FindReportingPeriodsWithCertification>) => {
  return (
    <ReportingPeriods
      reportingPeriods={reportingPeriodsWithCertification}
      organizationOfCurrentUser={organizationOfCurrentUser}
    />
  )
}
