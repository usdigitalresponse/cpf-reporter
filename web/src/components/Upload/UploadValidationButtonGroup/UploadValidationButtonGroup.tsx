import Button from 'react-bootstrap/Button'
const VALIDATED = 'VALIDATED'
const INVALIDATED = 'INVALIDATED'

const UploadValidationButtonGroup = ({
  latestValidation,
  invalidateUpload,
  validateUpload,
  isValidating,
  downloadFile,
}) => {
  /*
    If the upload hasn't been validated yet, both the "Invalidate" and "Validate" buttons are enabled.
    If the upload has been validated, the "Invalidate" button and the "Re-validate" button are enabled.
    If the upload has been invalidated, the "Validate" button is enabled, and the "Invalidate" button is disabled.
  */
  const renderValidationButtons = () => {
    switch (latestValidation?.reviewType) {
      case INVALIDATED:
        return (
          <>
            <Button variant="outline-primary" size="sm" disabled>
              Invalidate
            </Button>{' '}
            <Button variant="primary" size="sm" onClick={validateUpload}>
              Validate
            </Button>
          </>
        )
      case VALIDATED:
        return (
          <>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={invalidateUpload}
            >
              Invalidate
            </Button>{' '}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={validateUpload}
            >
              Re-validate
            </Button>
          </>
        )
      default:
        return (
          <>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={invalidateUpload}
            >
              Invalidate
            </Button>{' '}
            <Button variant="primary" size="sm" onClick={validateUpload}>
              Validate
            </Button>
          </>
        )
    }
  }

  return (
    <li className="list-group-item">
      <div className="float-end">
        <Button variant="primary" size="sm" onClick={downloadFile}>
          Download file
        </Button>{' '}
        {isValidating ? (
          <Button className="ml-2" size="sm" disabled>
            Validating...
          </Button>
        ) : (
          renderValidationButtons()
        )}
      </div>
    </li>
  )
}

export default UploadValidationButtonGroup
