import ReportingPeriodCell from 'src/components/ReportingPeriod/ReportingPeriodCell'

type ReportingPeriodPageProps = {
  id: number
}

const ReportingPeriodPage = ({ id }: ReportingPeriodPageProps) => {
  return <ReportingPeriodCell id={id} />
}

export default ReportingPeriodPage
