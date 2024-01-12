import { Button } from 'react-bootstrap'
import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
}

const Upload = ({ upload }: Props) => {
  return (
    <>
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Upload {upload.id} details:
        </h2>
      </header>
      <div className="row">
        <div className="col-sm-12 col-md-6 mb-sm-3 mb-md-1">
          <ul className="list-group">
            <li className="list-group-item">
              <span className="fw-bold">Filename: </span>
              {upload.filename}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Reporting period: </span>
              {upload.reportingPeriod.name}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">EC Code: </span>
              {upload.expenditureCategory.code}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Created: </span>
              {timeTag(upload.createdAt)} by {upload.uploadedBy.name}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Notes: </span>
              {upload.notes}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Validation: </span>
              WIP
            </li>
            <li className="list-group-item">
              <div className="float-end">
                <Button variant="primary" size="sm">
                  Download file
                </Button>{' '}
                <Button variant="outline-primary" size="sm">
                  Invalidate
                </Button>{' '}
                <Button variant="primary" size="sm">
                  Re-validate
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload
