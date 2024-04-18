import Button from 'react-bootstrap/Button'

interface ValidationError {
  message: string
  tab?: string
  row?: string
  col?: string
  severity: 'warn' | 'err' | 'info'
}

interface ValidationResult {
  errors: ValidationError[]
}

interface UploadValidationButtonGroupProps {
  latestValidation?: { passed: boolean; results: ValidationResult | null }
  handleFileDownload: () => void
  handleForceInvalidate: () => void
  handleValidate: () => void
}

const UploadValidationButtonGroup = ({
  latestValidation,
  handleFileDownload,
  handleForceInvalidate,
  handleValidate,
}: UploadValidationButtonGroupProps) => {
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
