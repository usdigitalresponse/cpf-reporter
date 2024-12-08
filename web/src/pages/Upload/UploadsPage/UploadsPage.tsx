import { ROLES } from 'api/src/lib/constants'
import { Button, ButtonGroup } from 'react-bootstrap'
import { useAuth } from 'web/src/auth'

import { useMutation, Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UploadsCell from 'src/components/Upload/UploadsCell'

const SEND_TREASURY_REPORT = gql`
  mutation sendTreasuryReport {
    sendTreasuryReport
  }
`
const GENERATE_TREASURY_REPORT = gql`
  mutation generateTreasuryReport($regenerate: Boolean!) {
    generateTreasuryReport(regenerate: $regenerate)
  }
`

const UploadsPage = () => {
  const { hasRole } = useAuth()
  const [sendTreasuryReport] = useMutation(SEND_TREASURY_REPORT, {
    onCompleted: () => {
      toast.success('Treasury Report has been sent')
    },
    onError: (error) => {
      toast.error('Error sending Treasury Report by email: ' + error.message)
    },
  })
  const [generateTreasuryReport] = useMutation(GENERATE_TREASURY_REPORT, {
    onCompleted: () => {
      toast.success('Treasury Report has been generated')
    },
    onError: (error) => {
      toast.error('Error genearting Treasury Report: ' + error.message)
    },
  })

  const handleSendTreasuryReportByEmail = () => {
    sendTreasuryReport()
  }

  const handleGenerateTreasuryReport = (regenerate) => {
    generateTreasuryReport({ variables: { regenerate } })
  }

  return (
    <>
      <Metadata title="Uploads Page" description="Uploads page" />

      <h2>Uploads</h2>

      <ButtonGroup className="my-2 mb-4">
        {/* TODO: Remove USDR_ADMIN check when ready || 2024-05-13 Milestone */}
        {hasRole(ROLES.USDR_ADMIN) && (
          <Button size="sm" variant="primary">
            Download Empty Template
          </Button>
        )}
        <Button
          size="sm"
          variant=""
          className="btn-outline-primary"
          href="/uploads/new"
        >
          Upload Workbook
        </Button>
        {(hasRole(ROLES.USDR_ADMIN) || hasRole(ROLES.ORGANIZATION_ADMIN)) && (
          <Button
            size="sm"
            variant=""
            className="btn-outline-primary"
            onClick={() => handleGenerateTreasuryReport(false)}
          >
            Generate and Send Treasury Report
          </Button>
        )}
        {(hasRole(ROLES.USDR_ADMIN) || hasRole(ROLES.ORGANIZATION_ADMIN)) && (
          <Button
            size="sm"
            variant=""
            className="btn-outline-primary"
            onClick={() => handleGenerateTreasuryReport(true)}
          >
            Force Regenerate and Send Treasury Report
          </Button>
        )}
        {/* TODO: Remove USDR_ADMIN check when ready || 2024-05-13 Milestone */}
        {(hasRole(ROLES.USDR_ADMIN) || hasRole(ROLES.ORGANIZATION_ADMIN)) && (
          <Button
            size="sm"
            variant=""
            className="btn-outline-primary"
            onClick={handleSendTreasuryReportByEmail}
          >
            Send Treasury Report By Email
          </Button>
        )}
      </ButtonGroup>

      <UploadsCell />
    </>
  )
}

export default UploadsPage
