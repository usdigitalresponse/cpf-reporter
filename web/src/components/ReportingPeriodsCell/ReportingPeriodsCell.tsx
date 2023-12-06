import type { ReportingPeriodsQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ReportingPeriodsQuery {
    reportingPeriods {
      id
      startDate
      endDate
      isCurrentPeriod
      certifiedAt
      certifiedBy
      inputTemplate {
        name
      }
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
          <td>{item.inputTemplate.name}{!item.certifiedAt && <span> <Link to={routes.uploadTemplate({id: item.id})}>Upload Template</Link></span>}</td>
          <td>{item.isCurrentPeriod ? (<button>Certify Reporting Period</button>) : (item.certifiedAt && (<span>{item.certifiedAt} by {item.certifiedBy}</span>))}</td>
        </tr>
      })}
    </table>
  )
}
