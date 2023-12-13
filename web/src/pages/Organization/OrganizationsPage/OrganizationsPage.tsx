import Button from 'react-bootstrap/Button'

import { Link, routes } from '@redwoodjs/router'

import OrganizationsCell from 'src/components/Organization/OrganizationsCell'
import { useCurrentUser } from 'src/hooks/useCurrentUser'

const OrganizationsPage = () => {
  const { isLoading, isAuthorized, username } = useCurrentUser()

  if (isLoading) {
    return null
  }
  const authorizedBody = (
    <>
      You successfully signed in with Passage.
      <br />
      <br />
      Your username is: <b>{username}</b>
    </>
  )

  const unauthorizedBody = (
    <>
      You have not logged in and cannot view the dashboard.
      <br />
      <br />
      <a href="/login">Login to continue.</a>
    </>
  )

  return (
    <div>
      <h2>Organizations</h2>
      <div>
        <div>{isAuthorized ? 'Welcome!' : 'Unauthorized'}</div>
        <div>{isAuthorized ? authorizedBody : unauthorizedBody}</div>
      </div>
      <br />
      <Link to={routes['newOrganization']()}>
        <Button variant={'primary'} className={'mb-3'}>
          Create New Organization
        </Button>
      </Link>
      <OrganizationsCell />
    </div>
  )
}

export default OrganizationsPage
