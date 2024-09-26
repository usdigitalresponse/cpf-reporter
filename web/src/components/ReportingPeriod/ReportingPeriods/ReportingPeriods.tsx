import { useState, useMemo, useCallback } from 'react'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useAuth } from 'web/src/auth'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ReportingPeriod/ReportingPeriodsCell/ReportingPeriodsCell'
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
  const { hasRole } = useAuth()
  const isUSDRAdmin = hasRole('USDR_ADMIN')

  const [showCertificationModal, setShowCertificationModal] = useState(false)

  const currentReportingPeriod = useMemo(
    () =>
      reportingPeriods.find(
        (period) =>
          period.id ===
          organizationOfCurrentUser.preferences.current_reporting_period_id
      ),
    [reportingPeriods, organizationOfCurrentUser]
  )

  const [certifyReportingPeriod] = useMutation(
    CERTIFY_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('Reporting period certified')
        setShowCertificationModal(false)
      },
      onError: (error) => {
        console.error(error)
        toast.error('Unable to certify the current reporting period.')
      },
      refetchQueries: [{ query: QUERY }],
    }
  )

  const handleCertify = useCallback(() => {
    if (currentReportingPeriod?.id) {
      certifyReportingPeriod({ variables: { id: currentReportingPeriod.id } })
    }
  }, [currentReportingPeriod, certifyReportingPeriod])

  const canEdit = useCallback(
    (reportingPeriod) => {
      return (
        isUSDRAdmin &&
        (reportingPeriod.id === currentReportingPeriod?.id ||
          new Date(reportingPeriod.startDate) >
            new Date(currentReportingPeriod?.endDate))
      )
    },
    [isUSDRAdmin, currentReportingPeriod]
  )

  const certificationDisplay = useCallback(
    (reportingPeriod) => {
      if (reportingPeriod.id === currentReportingPeriod?.id) {
        return (
          <Button
            onClick={() => setShowCertificationModal(true)}
            variant="primary"
            size="sm"
          >
            Certify Reporting Period
          </Button>
        )
      }

      const certification = reportingPeriod.certificationForOrganization
      if (certification) {
        return `${formatDateString(certification.createdAt)} by ${
          certification.certifiedBy.email
        }`
      }

      return ''
    },
    [currentReportingPeriod, setShowCertificationModal]
  )

  const columns = useMemo(
    () =>
      columnDefs({
        certificationDisplay,
        canEdit,
        isUSDRAdmin,
      }),
    [certificationDisplay, canEdit, isUSDRAdmin]
  )

  return (
    <>
      <Modal
        show={showCertificationModal}
        onHide={() => setShowCertificationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Certify Reporting Period</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Certify the{' '}
          <span className="fw-bold">{currentReportingPeriod?.name}</span>{' '}
          period?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCertify}>
            Certify
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setShowCertificationModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <TableBuilder
        data={reportingPeriods}
        columns={columns}
        filterableInputs={['name']}
      />
    </>
  )
}

export default ReportingPeriodsList
