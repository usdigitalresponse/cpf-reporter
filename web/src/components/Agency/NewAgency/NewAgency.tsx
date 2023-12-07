import type { CreateAgencyInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import AgencyForm from 'src/components/Agency/AgencyForm'


const CREATE_AGENCY_MUTATION = gql`
  mutation CreateAgencyMutation($input: CreateAgencyInput!) {
    createAgency(input: $input) {
      id
    }
  }
`

const NewAgency = () => {
  const [createAgency, { loading, error }] = useMutation(
    CREATE_AGENCY_MUTATION,
    {
      onCompleted: () => {
        toast.success('Agency created')
        navigate(routes.agencies())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateAgencyInput) => {
    createAgency({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary mb-3">Agency</h2>
      </header>
      <div className="rw-segment-main">
        <AgencyForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewAgency
