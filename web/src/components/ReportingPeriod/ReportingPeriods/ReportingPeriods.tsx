import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { timeTag, truncate } from 'src/lib/formatters'

const CERTIFY_REPORTING_PERIOD_MUTATION = gql`
  mutation CertifyReportingPeriodAndOpenNextPeriod($id: Int!) {
    certifyReportingPeriodAndOpenNextPeriod(reportingPeriodId: $id) {
      id
    }
  }
`

const ReportingPeriodsList = ({
  reportingPeriods,
  organizationOfCurrentUser,
}) => {
  console.log(reportingPeriods)
  console.log(organizationOfCurrentUser)

  const [certifyReportingPeriod] = useMutation(
    CERTIFY_REPORTING_PERIOD_MUTATION
  )

  const certificationDisplay = (reportingPeriod) => {
    if (
      reportingPeriod.id ===
      organizationOfCurrentUser.preferences.current_reporting_period_id
    ) {
      return (
        <button
          onClick={() =>
            certifyReportingPeriod({ variables: { id: reportingPeriod.id } })
          }
          className="rw-button rw-button-small rw-button-green"
        >
          Certify Reporting Period
        </button>
      )
    }

    const certification = reportingPeriod.certificationForOrganization
    if (certification) {
      return `${certification.createdAt} by ${certification.certifiedBy.email}`
    }

    return ''
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Certified At</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {reportingPeriods.map((reportingPeriod) => (
            <tr key={reportingPeriod.id}>
              <td>{truncate(reportingPeriod.name)}</td>
              <td>{timeTag(reportingPeriod.startDate)}</td>
              <td>{timeTag(reportingPeriod.endDate)}</td>
              <td>{certificationDisplay(reportingPeriod)}</td>
              <td>{timeTag(reportingPeriod.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.editReportingPeriod({ id: reportingPeriod.id })}
                    title={'Edit reportingPeriod ' + reportingPeriod.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportingPeriodsList
