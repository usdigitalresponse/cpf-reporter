import Button from 'react-bootstrap/Button'
import { Link, routes } from '@redwoodjs/router'

import AgenciesCell from 'src/components/Agency/AgenciesCell'

const AgenciesPage = () => {
  return (
    <div>
      <Link to={routes['newAgency']()}>
        <Button variant="primary" className="mb-3">Create New Agency</Button>
      </Link>
      <AgenciesCell />
    </div>
  )
}

export default AgenciesPage
