import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ReportingPeriodsCell from 'src/components/ReportingPeriodsCell'

const ReportingPeriodsPage = () => {
  return (
    <>
      <MetaTags title="ReportingPeriods" description="ReportingPeriods page" />

      <h2>Reporting Periods</h2>
      <Link to={routes['newReportingPeriod']()}>
        <Button variant={'primary'} className={'mb-3'}>
          Create New Reporting Period
        </Button>
      </Link>
      <ReportingPeriodsCell />
    </>
  )
}

export default ReportingPeriodsPage
