import type {
  FindReportingPeriodQuery,
  FindReportingPeriodQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindReportingPeriodQuery($id: Int!) {
    reportingPeriod: reportingPeriod(id: $id) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindReportingPeriodQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  reportingPeriod,
}: CellSuccessProps<
  FindReportingPeriodQuery,
  FindReportingPeriodQueryVariables
>) => {
  return <span>{reportingPeriod.name}</span>
}
