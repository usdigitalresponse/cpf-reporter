import { Form, FileField, HiddenField, Submit } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import TemplateUploadReportingPeriodCell from 'src/components/TemplateUploadReportingPeriodCell/TemplateUploadReportingPeriodCell'

const UploadTemplatePage = ({ id }) => {
  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <>
      <MetaTags title="UploadTemplate" description="UploadTemplate page" />

      <h1>Upload Period Template</h1>
      <TemplateUploadReportingPeriodCell id={id} />

      <Form onSubmit={onSubmit}>
        <FileField name="file" />
        <HiddenField name="reportingPeriodId" value={id} />
        <Submit>Upload</Submit>
      </Form>
      <p>
        Find me in{' '}
        <code>./web/src/pages/UploadTemplatePage/UploadTemplatePage.tsx</code>
      </p>
      <p>
        My default route is named <code>uploadTemplate</code>, link to me with `
        <Link to={routes.uploadTemplate({ id: id })}>UploadTemplate</Link>`
      </p>
    </>
  )
}

export default UploadTemplatePage
