import type { CreateOrgAgencyAdminInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NewOrganizationForm from 'src/components/Organization/NewOrganizationForm/NewOrganizationForm'

const CREATE_ORGANIZATION_AGENCY_ADMIN_MUTATION = gql`
  mutation CreateOrgAgencyAdminMutation($input: CreateOrgAgencyAdminInput!) {
    createOrgAgencyAdmin(input: $input) {
      organization {
        id
      }
    }
  }
`

const NewOrganization = () => {
  const [createOrganization, { loading, error }] = useMutation(
    CREATE_ORGANIZATION_AGENCY_ADMIN_MUTATION,
    {
      onCompleted: () => {
        toast.success('Organization created')
        navigate(routes.organizations())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateOrgAgencyAdminInput) => {
    createOrganization({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Organization</h2>
      </header>
      <div className="rw-segment-main">
        <NewOrganizationForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewOrganization
