import type {
  EditOutputTemplateById,
  UpdateOutputTemplateInput,
  UpdateOutputTemplateMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OutputTemplateForm from 'src/components/OutputTemplate/OutputTemplateForm'

export const QUERY: TypedDocumentNode<EditOutputTemplateById> = gql`
  query EditOutputTemplateById($id: Int!) {
    outputTemplate: outputTemplate(id: $id) {
      id
      name
      version
      effectiveDate
      rulesGeneratedAt
      createdAt
      updatedAt
    }
  }
`

const UPDATE_OUTPUT_TEMPLATE_MUTATION: TypedDocumentNode<
  EditOutputTemplateById,
  UpdateOutputTemplateMutationVariables
> = gql`
  mutation UpdateOutputTemplateMutation(
    $id: Int!
    $input: UpdateOutputTemplateInput!
  ) {
    updateOutputTemplate(id: $id, input: $input) {
      id
      name
      version
      effectiveDate
      rulesGeneratedAt
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  outputTemplate,
}: CellSuccessProps<EditOutputTemplateById>) => {
  const [updateOutputTemplate, { loading, error }] = useMutation(
    UPDATE_OUTPUT_TEMPLATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('OutputTemplate updated')
        navigate(routes.outputTemplates())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateOutputTemplateInput,
    id: EditOutputTemplateById['outputTemplate']['id']
  ) => {
    updateOutputTemplate({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit OutputTemplate {outputTemplate?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <OutputTemplateForm
          outputTemplate={outputTemplate}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
