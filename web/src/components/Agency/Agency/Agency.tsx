import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import {} from 'src/lib/formatters'

import type {
  DeleteAgencyMutationVariables,
  FindAgencyById,
} from 'types/graphql'

const DELETE_AGENCY_MUTATION = gql`
  mutation DeleteAgencyMutation($id: Int!) {
    deleteAgency(id: $id) {
      id
    }
  }
`

interface Props {
  agency: NonNullable<FindAgencyById['agency']>
}

const Agency = ({ agency }: Props) => {
  const [deleteAgency] = useMutation(DELETE_AGENCY_MUTATION, {
    onCompleted: () => {
      toast.success('Agency deleted')
      navigate(routes.agencies())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteAgencyMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete agency ' + id + '?')) {
      deleteAgency({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Agency {agency.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{agency.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{agency.name}</td>
            </tr>
            <tr>
              <th>Abbreviation</th>
              <td>{agency.abbreviation}</td>
            </tr>
            <tr>
              <th>Code</th>
              <td>{agency.code}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editAgency({ id: agency.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(agency.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Agency
