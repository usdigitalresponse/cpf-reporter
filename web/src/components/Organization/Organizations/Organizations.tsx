import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import type { FindOrganizations } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { truncate } from 'src/lib/formatters'

const OrganizationsList = ({ organizations }: FindOrganizations) => {
  return (
    <Table striped borderless>
      <thead>
        <tr>
          <th className={'border'}>Id</th>
          <th className={'border'}>Name</th>
          <th className="border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {organizations.map((organization) => (
          <tr key={organization.id}>
            <td className="border border-slate-700">
              {truncate(organization.id)}
            </td>
            <td className="border border-slate-700">
              {truncate(organization.name)}
            </td>
            <td className="border border-slate-700">
              <nav className="rw-table-actions">
                <Link
                  to={routes.editOrganization({ id: organization.id })}
                  title={'Edit organization ' + organization.id}
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

export default OrganizationsList
