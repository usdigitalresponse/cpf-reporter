import { MetaTags } from '@redwoodjs/web'

import ReportingPeriodsCell from 'src/components/ReportingPeriodsCell'

const ReportingPeriodsPage = () => {
  return (
    <>
      <MetaTags title="ReportingPeriods" description="ReportingPeriods page" />

      <h2>Reporting Periods</h2>
      <ReportingPeriodsCell />
    </>
  )
}

export default ReportingPeriodsPage
