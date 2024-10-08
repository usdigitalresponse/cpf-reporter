import type { EditUserById, UpdateUserInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserForm from 'src/components/User/UserForm'

export const QUERY = gql`
  query EditUserById($id: Int!) {
    user: user(id: $id) {
      id
      email
      name
      agencyId
      role
      isActive
      createdAt
      updatedAt
    }
  }
`
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      agencyId
      role
      isActive
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ user }: CellSuccessProps<EditUserById>) => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User updated')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateUserInput, id: EditUserById['user']['id']) => {
    updateUser({ variables: { id, input } })
  }

  return (
    <div>
      <header>
        <h2>Edit User {user?.id}</h2>
      </header>
      <div>
        <UserForm user={user} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
