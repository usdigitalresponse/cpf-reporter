import type { FindAgencyById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Agency from 'src/components/Agency/Agency'

export const QUERY = gql`
  query FindAgencyById($id: Int!) {
    agency: agency(id: $id) {
      id
      name
      abbreviation
      code
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Agency not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ agency }: CellSuccessProps<FindAgencyById>) => {
  return <Agency agency={agency} />
}
