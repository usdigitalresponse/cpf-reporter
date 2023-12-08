import { Button, ButtonGroup } from 'react-bootstrap'

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import UploadsList from '../../components/Upload/Uploads' // Import the UploadsList component

const DashboardPage = () => {
  return (
    <>
      <MetaTags title="Dashboard" description="Dashboard page" />

      <h2>Uploads</h2>
      {/* <p>
        My default route is named <code>dashboard</code>, link to me with `
        <Link to={routes.dashboard()}>Dashboard</Link>`
      </p> */}

      {/* <Link to={routes.dashboard()} title="Download Empty Template">
        <Button size="sm" variant="primary">
          Download Empty Template
        </Button>
      </Link>

      <Link to={routes.dashboard()} title="Upload Workbook">
        <Button size="sm" variant="secondary">
          Upload Workbook
        </Button>
      </Link>

      <Link
        to={routes.dashboard()}
        title="Send Treasury and/ Audit Reports by Email"
      >
        <Button size="sm" variant="secondary">
          Send Treasury and/ Audit Reports by Email
        </Button>
      </Link> */}

      <ButtonGroup aria-label="Basic example" className="my-4">
        <Button size="sm" variant="primary">
          Download Empty Template
        </Button>

        <Button size="sm" variant="link">
          Upload Workbook
        </Button>

        <Button size="sm" variant="">
          Send Treasury and/ Audit Reports by Email
        </Button>
      </ButtonGroup>

      <UploadsList />
    </>
  )
}

export default DashboardPage
