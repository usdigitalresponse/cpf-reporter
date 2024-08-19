import type {
  DeleteOutputTemplateMutation,
  DeleteOutputTemplateMutationVariables,
  FindOutputTemplateById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_OUTPUT_TEMPLATE_MUTATION: TypedDocumentNode<
  DeleteOutputTemplateMutation,
  DeleteOutputTemplateMutationVariables
> = gql`
  mutation DeleteOutputTemplateMutation($id: Int!) {
    deleteOutputTemplate(id: $id) {
      id
    }
  }
`

interface Props {
  outputTemplate: NonNullable<FindOutputTemplateById['outputTemplate']>
}

const OutputTemplate = ({ outputTemplate }: Props) => {
  const [deleteOutputTemplate] = useMutation(DELETE_OUTPUT_TEMPLATE_MUTATION, {
    onCompleted: () => {
      toast.success('OutputTemplate deleted')
      navigate(routes.outputTemplates())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteOutputTemplateMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete outputTemplate ' + id + '?')) {
      deleteOutputTemplate({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            OutputTemplate {outputTemplate.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{outputTemplate.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{outputTemplate.name}</td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{outputTemplate.version}</td>
            </tr>
            <tr>
              <th>Effective date</th>
              <td>{timeTag(outputTemplate.effectiveDate)}</td>
            </tr>
            <tr>
              <th>Rules generated at</th>
              <td>{timeTag(outputTemplate.rulesGeneratedAt)}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(outputTemplate.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(outputTemplate.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editOutputTemplate({ id: outputTemplate.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(outputTemplate.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default OutputTemplate
