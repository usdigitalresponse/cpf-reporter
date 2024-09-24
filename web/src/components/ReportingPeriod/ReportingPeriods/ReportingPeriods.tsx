import { useMutation } from '@redwoodjs/web'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'
import { formatDateString } from 'src/utils'

import { columnDefs } from './columns'

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
  const filterableInputs = ['name']
  console.log(reportingPeriods)
  console.log(organizationOfCurrentUser)

  const [certifyReportingPeriod] = useMutation(
    CERTIFY_REPORTING_PERIOD_MUTATION
  )

  const handleCertify = (id) => {
    certifyReportingPeriod({ variables: { id } })
  }

  const certificationDisplay = (reportingPeriod) => {
    if (
      reportingPeriod.id ===
      organizationOfCurrentUser.preferences.current_reporting_period_id
    ) {
      return (
        <button
          onClick={() => handleCertify(reportingPeriod.id)}
          className="btn btn-primary"
        >
          Certify Reporting Period
        </button>
      )
    }

    const certification = reportingPeriod.certificationForOrganization
    if (certification) {
      return `${formatDateString(certification.createdAt)} by ${
        certification.certifiedBy.email
      }`
    }

    return ''
  }

  const columns = columnDefs({ certificationDisplay })

  return (
    <TableBuilder
      data={reportingPeriods}
      columns={columns}
      filterableInputs={filterableInputs}
    />
  )
}

export default ReportingPeriodsList
