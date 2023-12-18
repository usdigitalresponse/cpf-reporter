import { Button, ButtonGroup } from 'react-bootstrap'

import { MetaTags } from '@redwoodjs/web'

import UploadsCell from 'src/components/Upload/UploadsCell'

const UploadsPage = () => {
  return (
    <>
      <MetaTags title="Uploads Page" description="Uploads page" />

      <h2>Uploads</h2>

      <ButtonGroup className="my-2 mb-4">
        <Button size="sm" variant="primary">
          Download Empty Template
        </Button>
        <Button size="sm" variant="" className="btn-outline-primary">
          Upload Workbook
        </Button>
        <Button size="sm" variant="" className="btn-outline-primary">
          Send Treasury and/ Audit Reports by Email
        </Button>
      </ButtonGroup>

      <UploadsCell />
    </>
  )
}

export default UploadsPage
