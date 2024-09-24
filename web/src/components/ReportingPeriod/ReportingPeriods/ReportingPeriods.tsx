import type { FindReportingPeriods } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { timeTag, truncate } from 'src/lib/formatters'

const ReportingPeriodsList = ({ reportingPeriods }: FindReportingPeriods) => {
  /*
    If certified, this should display: "[Date Certified] by [email of user who certified]" ex: "07/01/2024 by email@email.org"
    If Current reporting period, a button should display that says "Certify Reporting Period"
  */
  const certificationDisplay = (reportingPeriod) => {}

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
              <td>cerified by:</td>
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
