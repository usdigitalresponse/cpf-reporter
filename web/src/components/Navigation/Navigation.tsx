import { ROLES } from 'api/src/lib/constants'
import Nav from 'react-bootstrap/Nav'
import { useAuth } from 'web/src/auth'

import { NavLink, routes } from '@redwoodjs/router'

const Navigation = () => {
  const { hasRole } = useAuth()
  const canViewUsersTab =
    hasRole(ROLES.USDR_ADMIN) || hasRole(ROLES.ORGANIZATION_ADMIN)
  const canViewAdminTabs = hasRole(ROLES.USDR_ADMIN)

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
        {/* TODO: Remove USDR_ADMIN check when ready || 2024-05-13 Milestone */}
        {canViewAdminTabs && (
          <>
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
                to={routes.subrecipients()}
                activeClassName="active"
                className="nav-link"
              >
                Subrecipients
              </NavLink>
            </Nav.Item>
            {canViewUsersTab && (
              <Nav.Item>
                <NavLink
                  to={routes.users()}
                  activeClassName="active"
                  className="nav-link"
                >
                  Users
                </NavLink>
              </Nav.Item>
            )}
            <Nav.Item>
              <NavLink
                to={routes.reportingPeriods()}
                activeClassName="active"
                className="nav-link"
              >
                Reporting Periods
              </NavLink>
            </Nav.Item>
            {hasRole(ROLES.USDR_ADMIN) && (
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
            {hasRole(ROLES.USDR_ADMIN) && (
              <Nav.Item>
                <NavLink
                  to={routes.treasuryReportGenerationDeveloperTools()}
                  activeClassName="active"
                  className="nav-link"
                >
                  Treasury Report Generation Developer Tool
                </NavLink>
              </Nav.Item>
            )}
          </>
        )}
      </Nav>
    </div>
  )
}

export default Navigation
