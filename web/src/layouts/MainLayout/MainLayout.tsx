import { Link, routes } from '@redwoodjs/router'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
    <header>
      <h1>CPF Reporter: USDR</h1>
      <nav>
        <ul>
          <li>
            <Link to={routes.dashboard()}>Dashboard</Link>
          </li>
          <li>
            <Link to={routes.reportingPeriods()}>Reporting Periods</Link>
          </li>
        </ul>
      </nav>
      </header>
      <main>{children}</main>
      </>
      )
}

export default MainLayout
