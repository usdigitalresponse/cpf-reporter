import type { FindUploadById } from 'types/graphql'
import { useMutation, useQuery } from '@redwoodjs/web'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Upload from 'src/components/Upload/Upload'

export const QUERY = gql`
  query FindUploadById($id: Int!) {
    upload: upload(id: $id) {
      id
      filename
      uploadedBy {
        name
        organizationId
      }
      agency {
        id
        code
      }
      organizationId
      reportingPeriod {
        name
      }
      expenditureCategory {
        code
      }
      notes
      createdAt
      updatedAt
      latestValidation {
        agencyId
        organizationId
        inputTemplateId
        reviewResults
        reviewedBy {
          name
        }
        reviewType
        createdAt
      }
    }
  }
`

const CREATE_UPLOAD_VALIDATION = gql`
  mutation createUploadValidation($input: CreateUploadValidationInput!) {
    createUploadValidation(input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Upload not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ upload }: CellSuccessProps<FindUploadById>) => {
  const { refetch } = useQuery(QUERY, { variables: { id: upload.id } })

  // const [createUploadValidation, { loading, error }] = useMutation(
  //   CREATE_UPLOAD_VALIDATION,
  //   {
  //     onCompleted: () => {
  //       console.log('Upload validation created')  
  //     },
  //     onError: (error) => {
  //       // toast.error(error.message)
  //       console.log('Upload validation error')
  //     },
  //   }
  // )

  // const onSave = (
  //   input: CreateUploadValidationInput,
  // ) => {
  //   createUploadValidation({ variables: { input } })
  // }

  return <Upload upload={upload} refetch={refetch} />
}
