import { Button, ButtonGroup } from 'react-bootstrap'
import { useAuth } from 'web/src/auth'
import { ROLES } from 'api/src/lib/constants'

import { MetaTags } from '@redwoodjs/web'

import UploadsCell from 'src/components/Upload/UploadsCell'

const UploadsPage = () => {
  const { hasRole } = useAuth()

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
        {hasRole(ROLES.USDR_ADMIN) && (
          <Button size="sm" variant="" className="btn-outline-primary">
            Send Treasury and/ Audit Reports by Email
          </Button>
        )}
      </ButtonGroup>

      <UploadsCell />
    </>
  )
}

export default UploadsPage
