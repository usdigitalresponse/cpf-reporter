import type { FindUsersByOrganizationId } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Users from 'src/components/User/Users'

export const QUERY = gql`
  query FindUsersByOrganizationId($organizationId: Int!) {
    usersByOrganization(organizationId: $organizationId) {
      id
      email
      name
      agency {
        name
      }
      role
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No users yet. '}
      <Link to={routes.newUser()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  usersByOrganization,
}: CellSuccessProps<FindUsersByOrganizationId>) => {
  return <Users usersByOrganization={usersByOrganization} />
}
