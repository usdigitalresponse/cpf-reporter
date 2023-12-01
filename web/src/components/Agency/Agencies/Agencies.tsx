import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import type { FindAgencies } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { truncate } from 'src/lib/formatters'

const AgenciesList = ({ agencies }: FindAgencies) => {
  return (
    <div>
      <h2>Agencies</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Agency Code</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agencies.map((agency) => (
            <tr key={agency.id}>
              <td>
                {truncate(agency.code)}
              </td>
              <td>
                {truncate(agency.name)}
              </td>
              <td>
                <Link
                  to={routes.editAgency({ id: agency.id })}
                  title={'Edit agency ' + agency.id}
                >
                  <Button size="sm" variant="secondary">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default AgenciesList
