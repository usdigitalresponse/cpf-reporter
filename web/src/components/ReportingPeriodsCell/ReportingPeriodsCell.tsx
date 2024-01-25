import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
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
      certifiedBy {
        email
      }
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
    <Table striped borderless>
      <thead>
        <tr>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Template</th>
          <th>Certified At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reportingPeriods.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.startDate}</td>
              <td>{item.endDate}</td>
              <td>
                {item.inputTemplate?.name}
                {!item.certifiedAt && (
                  <span>
                    {' '}
                    <Link to={routes.uploadTemplate({ id: item.id })}>
                      Upload Template
                    </Link>
                  </span>
                )}
              </td>
              <td>
                {item.isCurrentPeriod ? (
                  <button>Certify Reporting Period</button>
                ) : (
                  item.certifiedAt && (
                    <span>
                      {item.certifiedAt} by {item.certifiedBy?.email}
                    </span>
                  )
                )}
              </td>
              <td className="border border-slate-700">
                <nav className="rw-table-actions">
                  <Link
                    to={routes.editReportingPeriod({ id: item.id })}
                    title={'Edit reporting period ' + item.id}
                  >
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                </nav>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
