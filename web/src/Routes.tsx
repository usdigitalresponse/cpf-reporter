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
      <Set wrap={ScaffoldLayout} title="Agencies" titleTo="agencies">
        <Route path="/agencies/new" page={AgencyNewAgencyPage} name="newAgency" />
        <Route path="/agencies/{id:Int}/edit" page={AgencyEditAgencyPage} name="editAgency" />
        <Route path="/agencies/{id:Int}" page={AgencyAgencyPage} name="agency" />
        <Route path="/agencies" page={AgencyAgenciesPage} name="agencies" />
      </Set>
      <Route notfound page={NotFoundPage} />
      {/* <Private unauthenticated="login">
          <Route path="/dashboard" page={DashboardPage} name="dashboard" />
          <Route path="/products/{sku}" page={ProductsPage} name="products" />
        </Private> */}
    </Router>
  )
}

export default Routes
