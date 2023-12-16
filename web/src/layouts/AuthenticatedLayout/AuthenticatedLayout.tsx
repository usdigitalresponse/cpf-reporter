import { Link, routes } from '@redwoodjs/router'

import Navigation from 'src/components/Navigation/Navigation'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div className="container-fluid" style={{ width: '90%' }}>
      <nav className="row navbar navbar-light bg-light">
        <Link to={routes.uploads()} className="navbar-brand">
          CPF Reporter: USDR
        </Link>
      </nav>
      <Navigation />

      {children}
    </div>
  )
}

export default AuthenticatedLayout
