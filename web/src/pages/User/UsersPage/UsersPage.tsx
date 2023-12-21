import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import UsersCell from 'src/components/User/UsersCell'

const UsersPage = () => {
  // temporarily hardcode organizationId to 1
  const organizationIdOfUser = 1

  return (
    <div>
      <h2>Users</h2>
      <Link to={routes['newUser']()}>
        <Button variant="primary" className="mb-3">
          Create New User
        </Button>
      </Link>
      <UsersCell organizationId={organizationIdOfUser} />
    </div>
  )
}

export default UsersPage
