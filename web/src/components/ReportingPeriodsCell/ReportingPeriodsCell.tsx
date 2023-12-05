import type { ReportingPeriodsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ReportingPeriodsQuery {
    reportingPeriods {
      id
      startDate
      endDate
      certifiedAt
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
}: CellSuccessProps<ReportingPeriodsQuery>) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Template</th>
          <th>Certified At</th>
        </tr>
      </thead>
      <tbody></tbody>
      {reportingPeriods.map((item) => {
        return <tr>
          <td>{item.startDate}</td>
          <td>{item.endDate}</td>
          <td>TODO</td>
          <td>{item.certifiedAt}</td>
        </tr>
      })}
    </table>
  )
}
