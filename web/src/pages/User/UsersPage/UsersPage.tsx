import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { Link, routes } from '@redwoodjs/router'

import UsersCell from 'src/components/User/UsersCell'

const UsersPage = () => {
  const { currentUser } = useAuth()
  const organizationIdOfUser = currentUser.agency.organizationId

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
