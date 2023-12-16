import Nav from 'react-bootstrap/Nav'

import { NavLink, routes } from '@redwoodjs/router'

const Navigation = () => {
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
          <NavLink
            to={routes.uploads()}
            activeClassName="active"
            className="nav-link"
          >
            Subrecipients
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink
            to={routes.uploads()}
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
        <Nav.Item>
          <NavLink
            to={routes.organizations()}
            activeClassName="active"
            className="nav-link"
          >
            Organizations
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  )
}

export default Navigation
