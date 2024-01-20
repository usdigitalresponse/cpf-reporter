import Button from 'react-bootstrap/Button'

const VALIDATED = 'VALIDATED'
const INVALIDATED = 'INVALIDATED'

const UploadValidationButtonGroup = ({
  latestValidation,
  invalidateUpload,
  validateUpload,
}) => {
  /*
    If upload hasn't been validated yet, both Invalidate and Validate buttons are enabled
    If upload has been validated, the Invalidate button and Re-validate buttons are enabled
    If upload has been invalidated, the Validate button is enabled and the Invalidate button is disabled
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
            <Button variant="primary" size="sm" onClick={validateUpload}>
              Re-Validate
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

  // TODO: Implement download file function
  const downloadFile = () => {}

  return (
    <li className="list-group-item">
      <div className="float-end">
        <Button variant="primary" size="sm" onClick={downloadFile}>
          Download file
        </Button>{' '}
        {renderValidationButtons()}
      </div>
    </li>
  )
}

export default UploadValidationButtonGroup
