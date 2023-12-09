import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import AgenciesCell from 'src/components/Agency/AgenciesCell'

const AgenciesPage = () => {
  // temporarily hardcode organizationId to 2
  const organizationIdOfUser = 2

  return (
    <div>
      <h2>Agencies</h2>
      <Link to={routes['newAgency']()}>
        <Button variant="primary" className="mb-3">
          Create New Agency
        </Button>
      </Link>
      <AgenciesCell organizationId={organizationIdOfUser} />
    </div>
  )
}

export default AgenciesPage
