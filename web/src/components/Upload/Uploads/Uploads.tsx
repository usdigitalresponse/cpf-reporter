import Table from 'react-bootstrap/Table'
import type { FindUploads } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { truncate } from 'src/lib/formatters'

const UploadsList = ({ uploads }: FindUploads) => {
  return (
    <div>
      <Table striped borderless>
        <thead>
          <tr>
            <th className="border">Id</th>
            <th className="border">Agency</th>
            <th className="border">EC Code</th>
            <th className="border">Uploaded By</th>
            <th className="border">Filename</th>
            <th className="border">Validated?</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map((upload) => (
            <tr key={upload.id}>
              <td className="border border-slate-700">
                <Link
                  to={routes.upload({ id: upload.id })}
                  title={'Show upload ' + upload.id + ' detail'}
                >
                  {upload.id}
                </Link>
              </td>
              <td className="border border-slate-700">
                {truncate(upload.agency.name)}
              </td>
              <td className="border border-slate-700">
                {truncate(upload.expenditureCategory.code)}
              </td>
              <td className="border border-slate-700">
                {truncate(upload.uploadedBy.email)}
              </td>
              <td className="border border-slate-700">
                {upload.filename}{' '}
                {/* TODO: Add file download when the API is ready */}
                {/* <Button size="sm" variant="primary">
                  Download file
                </Button> */}
              </td>
              <td className="border border-slate-700">Validation here!</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UploadsList
