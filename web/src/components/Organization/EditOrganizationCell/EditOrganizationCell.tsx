import type {
  EditOrganizationById,
  UpdateOrganizationInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OrganizationForm from 'src/components/Organization/OrganizationForm'

export const QUERY = gql`
  query EditOrganizationById($id: Int!) {
    organization: organization(id: $id) {
      id
      name
    }
  }
`
const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganizationMutation(
    $id: Int!
    $input: UpdateOrganizationInput!
  ) {
    updateOrganization(id: $id, input: $input) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  organization,
}: CellSuccessProps<EditOrganizationById>) => {
  const [updateOrganization, { loading, error }] = useMutation(
    UPDATE_ORGANIZATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Organization updated')
        navigate(routes.organizations())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateOrganizationInput,
    id: EditOrganizationById['organization']['id']
  ) => {
    updateOrganization({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit Organization {organization?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <OrganizationForm
          organization={organization}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
