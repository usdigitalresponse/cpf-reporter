import type { FindOrganizations } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Organizations from 'src/components/Organization/Organizations'

export const QUERY = gql`
  query FindOrganizations {
    organizations {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No organizations yet. '}
      <Link to={routes.newOrganization()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  organizations,
}: CellSuccessProps<FindOrganizations>) => {
  return <Organizations organizations={organizations} />
}
