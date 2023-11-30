import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import AgenciesCell from 'src/components/Agency/AgenciesCell'

const AgenciesPage = () => {
  return (
    <div>
     
      <Link
        to={routes['newAgency']()}
        className=""
      >
        <Button variant="primary">Create New Agency</Button>
      </Link>
      <AgenciesCell />
    </div>
  )
}


export default AgenciesPage
