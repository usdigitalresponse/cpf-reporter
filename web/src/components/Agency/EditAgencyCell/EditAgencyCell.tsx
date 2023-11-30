import type { EditAgencyById, UpdateAgencyInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AgencyForm from 'src/components/Agency/AgencyForm'

export const QUERY = gql`
  query EditAgencyById($id: Int!) {
    agency: agency(id: $id) {
      id
      name
      abbreviation
      code
    }
  }
`
const UPDATE_AGENCY_MUTATION = gql`
  mutation UpdateAgencyMutation($id: Int!, $input: UpdateAgencyInput!) {
    updateAgency(id: $id, input: $input) {
      id
      name
      abbreviation
      code
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ agency }: CellSuccessProps<EditAgencyById>) => {
  const [updateAgency, { loading, error }] = useMutation(
    UPDATE_AGENCY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Agency updated')
        navigate(routes.agencies())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateAgencyInput,
    id: EditAgencyById['agency']['id']
  ) => {
    updateAgency({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Agency {agency?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <AgencyForm
          agency={agency}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
