import type { FindUsersByOrganizationId } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web';
import { useState } from 'react';
import { toast } from '@redwoodjs/web/toast'

import Users from 'src/components/User/Users'

export const QUERY = gql`
  query FindUsersByOrganizationId($organizationId: Int!) {
    usersByOrganization(organizationId: $organizationId) {
      id
      email
      name
      agency {
        id,
        name
      }
      role
      isActive
      createdAt
      updatedAt
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No users yet. '}
      <Link to={routes.newUser()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  usersByOrganization,
  queryResult: { refetch }
}: CellSuccessProps<FindUsersByOrganizationId>) => {
  const [usersUpdating, setUsersUpdating] = useState(new Set());
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User updated');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const updateUser = async (user) => {
    const { email, name, role, isActive } = user;
    setUsersUpdating(usersUpdating.add(user.id));

    await updateUserMutation({
      variables: {
        id: user.id,
        input: {
          name,
          email,
          role,
          agencyId: user.agency.id,
          isActive
        }
      }
    })

    usersUpdating.delete(user.id);
    setUsersUpdating(new Set(usersUpdating));
    refetch();
  }

  return <Users
    usersByOrganization={usersByOrganization}
    updateUser={updateUser}
    usersUpdating={usersUpdating}
  />
}
