// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage
// 'src/pages/DeveloperTools/TreasuryReportGeneration/TreasuryReportGeneration.tsx'  -> DeveloperToolsTreasuryReportGeneration

import { PrivateSet, Router, Route } from '@redwoodjs/router'

import { useAuth } from './auth'
import AuthenticatedLayout from './layouts/AuthenticatedLayout/AuthenticatedLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <PrivateSet wrap={AuthenticatedLayout} unauthenticated="login">
        {/* Uploads */}
        <Route path="/" page={UploadUploadsPage} name="uploads" />
        <Route path="/uploads/new" page={UploadNewUploadPage} name="newUpload" />
        <Route path="/uploads/{id:Int}/edit" page={UploadEditUploadPage} name="editUpload" />
        <Route path="/uploads/{id:Int}" page={UploadUploadPage} name="upload" />
        <Route path="/upload-template/{id:Int}" page={UploadTemplatePage} name="uploadTemplate" />
        {/* Agencies */}
        <PrivateSet unauthenticated="forbidden" roles={['USDR_ADMIN', 'ORGANIZATION_ADMIN']}>
          <Route path="/agencies/{id:Int}/edit" page={AgencyEditAgencyPage} name="editAgency" />
          <Route path="/agencies/{id:Int}" page={AgencyAgencyPage} name="agency" />
          <Route path="/agencies/new" page={AgencyNewAgencyPage} name="newAgency" />
          <Route path="/agencies" page={AgencyAgenciesPage} name="agencies" />
        </PrivateSet>
        {/* Users */}
        <PrivateSet unauthenticated="forbidden" roles={['USDR_ADMIN', 'ORGANIZATION_ADMIN']}>
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </PrivateSet>
        {/* Subrecipients */}
        <PrivateSet unauthenticated="forbidden" roles={['USDR_ADMIN', 'ORGANIZATION_ADMIN']}>
          <Route path="/subrecipients" page={SubrecipientSubrecipientsPage} name="subrecipients" />
        </PrivateSet>
        {/* Reporting Periods */}
        <PrivateSet unauthenticated="forbidden" roles="USDR_ADMIN">
          <Route path="/reporting-periods/new" page={ReportingPeriodNewReportingPeriodPage} name="newReportingPeriod" />
          <Route path="/reporting-periods/{id:Int}/edit" page={ReportingPeriodEditReportingPeriodPage} name="editReportingPeriod" />
          <Route path="/reporting-periods/{id:Int}" page={ReportingPeriodReportingPeriodPage} name="reportingPeriod" />
        </PrivateSet>
        <PrivateSet unauthenticated="forbidden" roles={['USDR_ADMIN', 'ORGANIZATION_ADMIN']}>
          <Route path="/reporting-periods" page={ReportingPeriodReportingPeriodsPage} name="reportingPeriods" />
        </PrivateSet>
        {/* Organizations */}
        <PrivateSet unauthenticated="forbidden" roles="USDR_ADMIN">
          <Route path="/organizations/new" page={OrganizationNewOrganizationPage} name="newOrganization" />
          <Route path="/organizations/{id:Int}/edit" page={OrganizationEditOrganizationPage} name="editOrganization" />
          <Route path="/organizations/{id:Int}" page={OrganizationOrganizationPage} name="organization" />
          <Route path="/organizations" page={OrganizationOrganizationsPage} name="organizations" />
        </PrivateSet>
        {/* OutputTemplates */}
        <PrivateSet unauthenticated="forbidden" roles="USDR_ADMIN">
          <Route path="/output-templates/new" page={OutputTemplateNewOutputTemplatePage} name="newOutputTemplate" />
          <Route path="/output-templates/{id:Int}/edit" page={OutputTemplateEditOutputTemplatePage} name="editOutputTemplate" />
          <Route path="/output-templates/{id:Int}" page={OutputTemplateOutputTemplatePage} name="outputTemplate" />
          <Route path="/output-templates" page={OutputTemplateOutputTemplatesPage} name="outputTemplates" />
        </PrivateSet>
        {/* Developer Tools */}
        <PrivateSet unauthenticated="forbidden" roles="USDR_ADMIN">
          <Route path="/treasury-report-developer-tools" page={ToolsPageTreasuryReportGenerationPage} name="treasuryReportGenerationDeveloperTools" />
        </PrivateSet>
        {/* Forbidden page */}
        <Route path="/forbidden" page={ForbiddenPage} name="forbidden" />
      </PrivateSet>
      <Route path="/login" page={LoginPage} name="login" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
