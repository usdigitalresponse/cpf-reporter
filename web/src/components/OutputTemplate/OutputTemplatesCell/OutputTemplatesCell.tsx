import type {
  FindOutputTemplates,
  FindOutputTemplatesVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import OutputTemplates from 'src/components/OutputTemplate/OutputTemplates'

export const QUERY: TypedDocumentNode<
  FindOutputTemplates,
  FindOutputTemplatesVariables
> = gql`
  query FindOutputTemplates {
    outputTemplates {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No outputTemplates yet. '}
      <Link to={routes.newOutputTemplate()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindOutputTemplates>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  outputTemplates,
}: CellSuccessProps<FindOutputTemplates, FindOutputTemplatesVariables>) => {
  return <OutputTemplates outputTemplates={outputTemplates} />
}
