// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      {/* TODO: change to this Set after implementing user authentication */}
      {/* <Set private unauthenticated="forbidden" hasRole="admin"> */}
      {/* </Set> */}

      <Set wrap={ScaffoldLayout} title="Agencies" titleTo="agencies">
        <Route path="/agencies/{id:Int}/edit" page={AgencyEditAgencyPage} name="editAgency" />
        <Route path="/agencies/{id:Int}" page={AgencyAgencyPage} name="agency" />
        <Route path="/agencies/new" page={AgencyNewAgencyPage} name="newAgency" />
        <Route path="/agencies" page={AgencyAgenciesPage} name="agencies" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
