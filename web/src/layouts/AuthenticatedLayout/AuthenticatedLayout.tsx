import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { Link, routes } from '@redwoodjs/router'

import Navigation from 'src/components/Navigation/Navigation'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

  return (
    <div className="container-fluid" style={{ width: '90%' }}>
      <nav className="row navbar navbar-light bg-light d-flex justify-content-between">
        <div className="col">
          <Link to={routes.uploads()} className="navbar-brand">
            CPF Reporter: USDR
          </Link>
        </div>
        <div className="col d-flex justify-content-end">
          {/* Replace the code below when authentication is complete */}
          <div className="navbar-text">email@email.com</div>
          <Button
            size="sm"
            variant="link"
            className="nav-link navbar-text mx-2"
            onClick={logOut}
          >
            Logout
          </Button>

          {/* Use the code below for conditional currentUser logic */}
          {/* {isAuthenticated && (
            <>
              <div className="navbar-text">{currentUser.email}</div>
              <Button
                size="sm"
                variant="link"
                className="nav-link navbar-text mx-2"
                onClick={logOut}
              >
                Logout
              </Button>
            </>
          )} */}
        </div>
      </nav>
      <Navigation />

      {children}
    </div>
  )
}

export default AuthenticatedLayout
