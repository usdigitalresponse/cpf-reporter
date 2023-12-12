import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import UsersCell from 'src/components/User/UsersCell'

const UsersPage = () => {
  return (
    <div>
      <h2>Users</h2>
      <Link to={routes['newUser']()}>
        <Button variant="primary" className="mb-3">
          Create New User
        </Button>
      </Link>
      <UsersCell />
    </div>
  )
}

export default UsersPage
