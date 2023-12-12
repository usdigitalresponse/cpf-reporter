import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import type {
  DeleteUserMutationVariables,
  FindUsersByOrganizationId,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/User/UsersCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_USER_MUTATION = gql`
  mutation DeleteUserMutation($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const UsersList = ({ usersByOrganization }: FindUsersByOrganizationId) => {
  return (
    <Table striped borderless>
      <thead>
        <tr>
          <th className="border">Email</th>
          <th className="border">Name</th>
          <th className="border">Agency id</th>
          <th className="border">Role id</th>
          <th className="border">Created at</th>
          <th className="border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {usersByOrganization.map((user) => (
          <tr key={user.id}>
            <td className="border border-slate-700">{truncate(user.email)}</td>
            <td className="border border-slate-700">{truncate(user.name)}</td>
            <td className="border border-slate-700">
              {truncate(user.agencyId)}
            </td>
            <td className="border border-slate-700">{truncate(user.roleId)}</td>
            <td className="border border-slate-700">
              {timeTag(user.createdAt)}
            </td>
            <td className="border border-slate-700">
              <nav className="rw-table-actions">
                <Link
                  to={routes.editUser({ id: user.id })}
                  title={'Edit user ' + user.id}
                  className="rw-button rw-button-small rw-button-blue"
                >
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </Link>
              </nav>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UsersList
