import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import OrganizationsCell from 'src/components/Organization/OrganizationsCell'

const OrganizationsPage = () => {
  return (
    <div>
      <h2>Organizations</h2>
      <Link to={routes['newOrganization']()}>
        <Button variant={'primary'} className={'mb-3'}>
          Create New Organization
        </Button>
      </Link>
      <OrganizationsCell />
    </div>
  )
}

export default OrganizationsPage
