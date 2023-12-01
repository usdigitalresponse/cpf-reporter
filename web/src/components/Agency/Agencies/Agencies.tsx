import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import type { FindAgencies } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { truncate } from 'src/lib/formatters'

const AgenciesList = ({ agencies }: FindAgencies) => {
  return (
    <Table striped borderless>
      <thead>
        <tr>
          <th className="border">Agency Code</th>
          <th className="border">Name</th>
          <th className="border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {agencies.map((agency) => (
          <tr key={agency.id}>
            <td className="border border-slate-700">
              {truncate(agency.code)}
            </td>
            <td className="border border-slate-700">
              {truncate(agency.name)}
            </td>
            <td className="border border-slate-700">
              <nav className="rw-table-actions">
                <Link
                  to={routes.editAgency({ id: agency.id })}
                  title={'Edit agency ' + agency.id}
                >
                  <Button size="sm" variant="secondary">Edit</Button>
                </Link>
              </nav>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default AgenciesList
