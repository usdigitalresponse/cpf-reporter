import { ROLES } from 'api/src/lib/constants'
import { Button, ButtonGroup } from 'react-bootstrap'
import { useAuth } from 'web/src/auth'

import { useMutation, MetaTags } from '@redwoodjs/web'

import UploadsCell from 'src/components/Upload/UploadsCell'

const SEND_TREASURY_REPORT = gql`
  mutation sendTreasuryReport {
    sendTreasuryReport
  }
`

const UploadsPage = () => {
  const { hasRole } = useAuth()
  const [sendTreasuryReport] = useMutation(SEND_TREASURY_REPORT, {
    onCompleted: () => {
      console.log('Treasury Report sent by email')
    },
    onError: (error) => {
      console.error('Error sending Treasury Report by email', error)
    },
  })

  const handleSendTreasuryReportByEmail = () => {
    sendTreasuryReport()
  }

  return (
    <>
      <MetaTags title="Uploads Page" description="Uploads page" />

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
