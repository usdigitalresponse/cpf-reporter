import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ReportingPeriodsCell'
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
  const currentReportingPeriod = reportingPeriods.find(
    (period) =>
      period.id ===
      organizationOfCurrentUser.preferences.current_reporting_period_id
  )

  console.log(reportingPeriods)
  console.log(organizationOfCurrentUser)

  const [certifyReportingPeriod] = useMutation(
    CERTIFY_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('Reporting period certified')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleCertify = () => {
    if (currentReportingPeriod.id) {
      certifyReportingPeriod({ variables: { id: currentReportingPeriod.id } })
      setShow(false)
    }
  }

  const certificationDisplay = (reportingPeriod) => {
    if (reportingPeriod.id === currentReportingPeriod.id) {
      return (
        <button
          // onClick={() => handleCertify(reportingPeriod.id)}
          onClick={handleShow}
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
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Certify Reporting Period</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Certify the{' '}
          <span className="fw-bold">{currentReportingPeriod.name}</span> period?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCertify}>
            Certify
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <TableBuilder
        data={reportingPeriods}
        columns={columns}
        filterableInputs={filterableInputs}
      />
    </>
  )
}

export default ReportingPeriodsList
