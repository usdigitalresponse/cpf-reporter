import type {
  FindOutputTemplateById,
  FindOutputTemplateByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import OutputTemplate from 'src/components/OutputTemplate/OutputTemplate'

export const QUERY: TypedDocumentNode<
  FindOutputTemplateById,
  FindOutputTemplateByIdVariables
> = gql`
  query FindOutputTemplateById($id: Int!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>OutputTemplate not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindOutputTemplateByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  outputTemplate,
}: CellSuccessProps<
  FindOutputTemplateById,
  FindOutputTemplateByIdVariables
>) => {
  return <OutputTemplate outputTemplate={outputTemplate} />
}
