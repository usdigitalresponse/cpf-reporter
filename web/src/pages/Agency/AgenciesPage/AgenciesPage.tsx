import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import AgenciesCell from 'src/components/Agency/AgenciesCell'

const AgenciesPage = () => {
  // temporarily hardcode tenantId to 2
  const tenantIdOfUser = 2;

  return (
    <div>
      <h2>Agencies</h2>
      <Button variant="primary" className="mb-3">Create New Agency</Button>
      {/* <Link to={routes['newAgency']()}>
        <Button variant="primary" className="mb-3">Create New Agency</Button>
      </Link> */}
      <AgenciesCell tenantId={tenantIdOfUser} />
    </div>
  )
}

export default AgenciesPage
