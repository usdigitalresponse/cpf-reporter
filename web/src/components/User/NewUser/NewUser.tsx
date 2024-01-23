import { useState } from 'react'

import type { CreateUserInput } from 'types/graphql'
import { useAuth } from 'web/src/auth'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserForm from 'src/components/User/UserForm'

const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`

const GET_AGENCIES_UNDER_USER_ORGANIZATION = gql`
  query agenciesUnderUserOrganization($organizationId: Int!) {
    agenciesUnderCurrentUserOrganization(organizationId: $organizationId) {
      id
      name
      code
    }
  }
`

const NewUser = () => {
  const { currentUser } = useAuth()
  const organizationIdOfUser = currentUser.organizationId

  const [createUser, { loading, error }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User created')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Step 1: Define a state variable for agencies
  const [agencies, setAgencies] = useState([])

  // Step 2: Fetch the agencies data
  const { data } = useQuery(GET_AGENCIES_UNDER_USER_ORGANIZATION, {
    variables: { organizationId: organizationIdOfUser }, // Replace with the appropriate organizationId
    onCompleted: (data) => {
      setAgencies(data.agenciesUnderCurrentUserOrganization)
    },
  })

  const onSave = (input: CreateUserInput) => {
    createUser({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New User</h2>
      </header>
      <div className="rw-segment-main">
        <UserForm
          onSave={onSave}
          loading={loading}
          error={error}
          agencies={agencies}
        />
      </div>
    </div>
  )
}

export default NewUser
