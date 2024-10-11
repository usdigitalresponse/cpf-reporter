import { ROLES } from 'api/src/lib/constants'
import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { Severity } from 'src/components/Upload/UploadValidationResultsTable/UploadValidationResultsTable'

interface ValidationError {
  message: string
  tab?: string
  row?: string
  col?: string
  severity: Severity
}

interface ValidationResult {
  errors: ValidationError[]
}

interface UploadValidationButtonGroupProps {
  latestValidation?: {
    passed: boolean
    isManual: boolean
    results: ValidationResult | null
  }
  handleFileDownload: () => void
  handleForceInvalidate: () => void
  handleValidate: () => void
  savingUpload: boolean
}

const UploadValidationButtonGroup = ({
  latestValidation,
  handleFileDownload,
  handleForceInvalidate,
  savingUpload,
}: UploadValidationButtonGroupProps) => {
  const { hasRole } = useAuth()
  /*
    If the upload has been validated, renders "Invalidate" and "Re-validate" buttons
    If the upload has been invalidated, renders the "Validate" button
  */
  const renderValidationButtons = () => {
    const { passed } = latestValidation

    return (
      <>
        {passed && hasRole(ROLES.USDR_ADMIN) && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleForceInvalidate}
            disabled={savingUpload}
          >
            Invalidate
          </Button>
        )}{' '}
        {/* <Button variant="primary" size="sm" onClick={handleValidate}>
          {passed || manuallyInvalidated ? 'Re-Validate' : 'Validate'}
        </Button> */}
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
