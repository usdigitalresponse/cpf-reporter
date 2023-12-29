import Nav from 'react-bootstrap/Nav'
import { useAuth } from 'web/src/auth'

import { NavLink, routes } from '@redwoodjs/router'

const Navigation = () => {
  const { currentUser } = useAuth()

  return (
    <div className="tabs-wrapper row">
      <Nav variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <NavLink
            to={routes.uploads()}
            activeClassName="active"
            className="nav-link"
          >
            Uploads
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to={routes.agencies()}
            activeClassName="active"
            className="nav-link"
          >
            Agencies
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <div className="nav-link disabled">Subrecipients</div>
        </Nav.Item>
        {/* TODO: Use the code below when "Subrecipients" page is ready */}
        {/* <Nav.Item>
          <NavLink
            to={routes.subrecipients()}
            activeClassName="active"
            className="nav-link"
          >
            Subrecipients
          </NavLink>
        </Nav.Item> */}
        <Nav.Item>
          <NavLink
            to={routes.users()}
            activeClassName="active"
            className="nav-link"
          >
            Users
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to={routes.reportingPeriods()}
            activeClassName="active"
            className="nav-link"
          >
            Reporting Periods
          </NavLink>
        </Nav.Item>
        {currentUser?.roles?.includes('usdr-admin') && (
          <Nav.Item>
            <NavLink
              to={routes.organizations()}
              activeClassName="active"
              className="nav-link"
            >
              Organizations
            </NavLink>
          </Nav.Item>
        )}
      </Nav>
    </div>
  )
}

export default Navigation
