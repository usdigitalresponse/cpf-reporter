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
      <Set wrap={ScaffoldLayout} title="Uploads" titleTo="uploads" buttonLabel="New Upload" buttonTo="newUpload">
        <Route path="/uploads/new" page={UploadNewUploadPage} name="newUpload" />
        <Route path="/uploads/{id:Int}/edit" page={UploadEditUploadPage} name="editUpload" />
        <Route path="/uploads/{id:Int}" page={UploadUploadPage} name="upload" />
        <Route path="/" page={UploadUploadsPage} name="uploads" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Organizations" titleTo="organizations" buttonLabel="New Organization" buttonTo="newOrganization">
        <Route path="/organizations/new" page={OrganizationNewOrganizationPage} name="newOrganization" />
        <Route path="/organizations/{id:Int}/edit" page={OrganizationEditOrganizationPage} name="editOrganization" />
        <Route path="/organizations/{id:Int}" page={OrganizationOrganizationPage} name="organization" />
        <Route path="/organizations" page={OrganizationOrganizationsPage} name="organizations" />
      </Set>
      {/* TODO: change to this Set after implementing user authentication */}
      {/* <Set private unauthenticated="forbidden" hasRole="admin"> */}
      {/* </Set> */}

      <Set wrap={ScaffoldLayout} title="Agencies" titleTo="agencies">
        <Route path="/agencies/{id:Int}/edit" page={AgencyEditAgencyPage} name="editAgency" />
        <Route path="/agencies/{id:Int}" page={AgencyAgencyPage} name="agency" />
        <Route path="/agencies/new" page={AgencyNewAgencyPage} name="newAgency" />
        <Route path="/agencies" page={AgencyAgenciesPage} name="agencies" />
        <Route path="/upload-template/{id:Int}" page={UploadTemplatePage} name="uploadTemplate" />
        <Route path="/reporting-periods" page={ReportingPeriodsPage} name="reportingPeriods" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
