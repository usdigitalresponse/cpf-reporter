import type { FindSubrecipients } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Subrecipients from 'src/components/Subrecipient/Subrecipients'

export const QUERY = gql`
  query FindSubrecipients {
    subrecipients {
      id
      ueiTinCombo
      createdAt
      updatedAt
      validSubrecipientUploads {
        id
        parsedSubrecipient {
          name
          recipientId
          pocName
          pocPhoneNumber
          pocEmailAddress
          zip5
          zip4
          addressLine1
          addressLine2
          addressLine3
          city
          state
        }
        upload {
          id
          filename
        }
        createdAt
        updatedAt
      }
      invalidSubrecipientUploads {
        id
        upload {
          id
          filename
        }
        createdAt
        updatedAt
      }
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

export const Success = ({
  subrecipients,
}: CellSuccessProps<FindSubrecipients>) => {
  return <Subrecipients subrecipients={subrecipients} />
}
