import EditReportingPeriodCell from 'src/components/ReportingPeriod/EditReportingPeriodCell'

type ReportingPeriodPageProps = {
  id: number
}

const EditReportingPeriodPage = ({ id }: ReportingPeriodPageProps) => {
  return <EditReportingPeriodCell id={id} />
}

export default EditReportingPeriodPage
