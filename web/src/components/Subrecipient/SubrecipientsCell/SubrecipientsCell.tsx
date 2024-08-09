// import type { FindSubrecipientsByOrganizationId } from 'types/graphql'

// import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Subrecipients from 'src/components/Subrecipient/Subrecipients'

export const QUERY = gql`
  query subrecipients {
    subrecipients {
      id
      ueiTinCombo
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div className="rw-text-center">{'No subrecipients yet. '}</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

// export const Success = ({
//     subrecipients,
//   }: CellSuccessProps<FindSubrecipients>) => {
//     return <Subrecipients subrecipients={subrecipients} />
//   }

export const Success = ({ subrecipients }: CellSuccessProps) => {
  return <Subrecipients subrecipients={subrecipients} />
}
