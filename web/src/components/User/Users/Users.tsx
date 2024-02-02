import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import type { FindUsersByOrganizationId } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { timeTag, truncate, formatEnum } from 'src/lib/formatters'

const UsersList = ({ usersByOrganization }: FindUsersByOrganizationId) => {
  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Role</th>
          <th>Agency</th>
          <th>Created at</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {usersByOrganization.map((user) => (
          <tr key={user.id}>
            <td>{truncate(user.email)}</td>
            <td>{truncate(user.name)}</td>
            <td>{formatEnum(user.role)}</td>
            <td>{truncate(user.agency?.name)}</td>
            <td>{timeTag(user.createdAt)}</td>
            <td>
              <Link
                to={routes.editUser({ id: user.id })}
                title={'Edit user ' + user.id}
              >
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UsersList
