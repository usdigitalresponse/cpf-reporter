import type { FindAgenciesByOrganizationId } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Agencies from 'src/components/Agency/Agencies'

export const QUERY = gql`
  query FindAgenciesByTenantId($organizationId: Int!) {
    agenciesByOrganization(organizationId: $organizationId) {
      id
      name
      abbreviation
      code
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No agencies yet. '}
      <Link to={routes.newAgency()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
                          agenciesByOrganization,
}: CellSuccessProps<FindAgenciesByOrganizationId>) => {
  return <Agencies agencies={agenciesByOrganization} />
}
