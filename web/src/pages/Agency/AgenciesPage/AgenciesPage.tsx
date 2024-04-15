import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { Link, routes } from '@redwoodjs/router'

import AgenciesCell from 'src/components/Agency/AgenciesCell'

const AgenciesPage = () => {
  const { currentUser } = useAuth()
  const organizationIdOfUser = currentUser.agency.organizationId

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
