import { useMutation } from '@redwoodjs/web'

import { timeTag } from 'src/lib/formatters'

import UploadValidationButtonGroup from '../UploadValidationButtonGroup/UploadValidationButtonGroup'
import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'
import UploadValidationStatus from '../UploadValidationStatus/UploadValidationStatus'

const DOWNLOAD_UPLOAD_FILE = gql`
  mutation downloadUploadFile($id: Int!) {
    downloadUploadFile(id: $id)
  }
`
const Upload = ({ upload }) => {
  const hasErrors =
    upload.latestValidation?.results !== null &&
    Array.isArray(upload.latestValidation?.results) &&
    upload.latestValidation?.results.length > 0

  const [downloadUploadFile] = useMutation(DOWNLOAD_UPLOAD_FILE, {
    onCompleted: ({ downloadUploadFile }) => {
      console.log(downloadUploadFile)
      console.log('Opening download file link in new tab..')
      window.open(downloadUploadFile, '_blank').focus()
    },
    onError: (error) => {
      console.error('Error downloading upload file', error)
    },
  })
  const handleFileDownload = () => {
    downloadUploadFile({ variables: { id: upload.id } })
  }

  const handleValidate = () => {}
  const handleForceInvalidate = () => {}

  return (
    <>
      {hasErrors && (
        <UploadValidationResultsTable
          errors={upload.latestValidation?.results}
        />
      )}

      <h3>Upload {upload.id} details</h3>
      <div className="row">
        <div className="col">
          <ul className="list-group">
            <li className="list-group-item">
              <span className="fw-bold">Filename: </span>
              {upload.filename}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Reporting period: </span>
              {upload.reportingPeriod?.name}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Agency: </span>
              {upload.agency?.code}
            </li>
            <li
              className={`list-group-item ${
                !upload.expenditureCategory?.code && 'list-group-item-warning'
              }`}
            >
              <span className="fw-bold">EC Code: </span>
              {upload.expenditureCategory?.code || 'Not set'}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Created: </span>
              {timeTag(upload.createdAt)} by {upload.uploadedBy.name}
            </li>
            {upload.latestValidation && (
              <>
                <UploadValidationStatus
                  latestValidation={upload.latestValidation}
                />
                <UploadValidationButtonGroup
                  latestValidation={upload.latestValidation}
                  handleValidate={handleValidate}
                  handleForceInvalidate={handleForceInvalidate}
                  handleFileDownload={handleFileDownload}
                />
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload
