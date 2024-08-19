import type {
  DeleteOutputTemplateMutation,
  DeleteOutputTemplateMutationVariables,
  FindOutputTemplates,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/OutputTemplate/OutputTemplatesCell'
import { timeTag, truncate } from 'src/lib/formatters'

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

const OutputTemplatesList = ({ outputTemplates }: FindOutputTemplates) => {
  const [deleteOutputTemplate] = useMutation(DELETE_OUTPUT_TEMPLATE_MUTATION, {
    onCompleted: () => {
      toast.success('OutputTemplate deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteOutputTemplateMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete outputTemplate ' + id + '?')) {
      deleteOutputTemplate({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Version</th>
            <th>Effective date</th>
            <th>Rules generated at</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {outputTemplates.map((outputTemplate) => (
            <tr key={outputTemplate.id}>
              <td>{truncate(outputTemplate.id)}</td>
              <td>{truncate(outputTemplate.name)}</td>
              <td>{truncate(outputTemplate.version)}</td>
              <td>{timeTag(outputTemplate.effectiveDate)}</td>
              <td>{timeTag(outputTemplate.rulesGeneratedAt)}</td>
              <td>{timeTag(outputTemplate.createdAt)}</td>
              <td>{timeTag(outputTemplate.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.outputTemplate({ id: outputTemplate.id })}
                    title={
                      'Show outputTemplate ' + outputTemplate.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editOutputTemplate({ id: outputTemplate.id })}
                    title={'Edit outputTemplate ' + outputTemplate.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete outputTemplate ' + outputTemplate.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(outputTemplate.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OutputTemplatesList
