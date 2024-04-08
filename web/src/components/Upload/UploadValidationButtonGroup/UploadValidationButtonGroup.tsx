import Button from 'react-bootstrap/Button'

const UploadValidationButtonGroup = ({
  latestValidation,
  handleFileDownload,
  handleForceInvalidate,
  handleValidate,
}) => {
  /*
    If the upload has been validated, renders "Invalidate" and "Re-validate" buttons
    If the upload has been invalidated, renders the "Validate" button
  */
  const renderValidationButtons = () => {
    const { passed } = latestValidation

    return (
      <>
        {passed && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleForceInvalidate}
          >
            Invalidate
          </Button>
        )}{' '}
        <Button variant="primary" size="sm" onClick={handleValidate}>
          {passed ? 'Re-Validate' : 'Validate'}
        </Button>
      </>
    )
  }

  return (
    <li className="list-group-item">
      <div className="float-end">
        <Button variant="primary" size="sm" onClick={handleFileDownload}>
          Download file
        </Button>{' '}
        {latestValidation?.results && renderValidationButtons()}
      </div>
    </li>
  )
}

export default UploadValidationButtonGroup
