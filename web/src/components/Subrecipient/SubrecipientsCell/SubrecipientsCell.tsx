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
      latestValidSubrecipientUpload {
        id
        upload {
          id
          filename
          latestValidation {
            passed
            results
          }
        }
        createdAt
        updatedAt
      }
      validSubrecipientUploads {
        id
        upload {
          id
          filename
          latestValidation {
            passed
            results
          }
        }
        createdAt
        updatedAt
      }
      invalidAndProcessingSubrecipientUploads {
        id
        upload {
          id
          filename
          latestValidation {
            passed
            results
          }
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
