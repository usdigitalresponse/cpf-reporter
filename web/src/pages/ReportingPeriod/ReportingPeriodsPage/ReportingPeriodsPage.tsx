import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { Link, routes } from '@redwoodjs/router'

import ReportingPeriodsCell from 'src/components/ReportingPeriod/ReportingPeriodsCell/ReportingPeriodsCell'

const ReportingPeriodsPage = () => {
  const { hasRole } = useAuth()

  return (
    <>
      <h2>Reporting Periods</h2>
      {hasRole('USDR_ADMIN') && (
        <Link to={routes['newReportingPeriod']()}>
          <Button variant="primary" className="mb-3">
            Create New Reporting Period
          </Button>
        </Link>
      )}
      <ReportingPeriodsCell />
    </>
  )
}

export default ReportingPeriodsPage
