import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { ROLES } from 'api/src/lib/constants'
import { useAuth } from 'web/src/auth'

import { Link, routes } from '@redwoodjs/router'
import { timeTag, truncate, formatEnum } from 'src/lib/formatters';

const UsersList = ({ usersByOrganization, updateUser, usersUpdating }) => {
  const currentUserIsOrgAdmin = useAuth().hasRole(ROLES.ORGANIZATION_ADMIN);

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
        {usersByOrganization.map((user) => {
          const userName = user.isActive ? user.name : user.name + ' (Deactivated)';
          const deactivateTitle = user.isActive ? 'Deactivate user ' + user.id : 'Reactivate user ' + user.id;
          const deactivateLabel = user.isActive ? 'Deactivate' : 'Reactivate';

          return (
            <tr key={user.id}>
              <td>{truncate(user.email)}</td>
              <td>{truncate(userName)}</td>
              <td>{formatEnum(user.role)}</td>
              <td>{truncate(user.agency?.name)}</td>
              <td>{timeTag(user.createdAt)}</td>
              <td>
                <div className="d-grid gap-2 d-xl-block">
                  <Link
                    to={routes.editUser({ id: user.id })}
                    className="btn btn-secondary btn-sm me-xl-2"
                    title={'Edit user ' + user.id}
                  >
                    Edit
                  </Link>

                  {currentUserIsOrgAdmin && user.role !== ROLES.USDR_ADMIN && (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      title={deactivateTitle}
                      onClick={() => updateUser({ ...user, isActive: !user.isActive })}
                      disabled={usersUpdating.has(user.id)}
                    >
                      {deactivateLabel}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default UsersList
