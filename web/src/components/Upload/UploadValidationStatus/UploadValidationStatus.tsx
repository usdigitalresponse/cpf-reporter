import { timeTag } from 'src/lib/formatters'

interface User {
  name: string
}

interface UploadValidation {
  reviewType: 'VALIDATED' | 'INVALIDATED' | null
  reviewedAt: string
  reviewedBy?: User
}

interface Props {
  uploadValidation?: UploadValidation
}

const VALIDATED = 'VALIDATED'
const INVALIDATED = 'INVALIDATED'

const UploadValidationStatus = ({ uploadValidation }: Props) => {
  const renderValidationIcon = (reviewType: string) => {
    return reviewType === INVALIDATED ? (
      <i className="bi bi-x-circle-fill"></i>
    ) : (
      <i className="bi bi-check-lg"></i>
    )
  }

  const displayValidationStatus = () => {
    switch (uploadValidation?.reviewType) {
      case INVALIDATED:
        return (
          <span className="text-danger">
            {renderValidationIcon(INVALIDATED)} Invalidated on{' '}
            {timeTag(uploadValidation.reviewedAt)} by{' '}
            {uploadValidation.reviewedBy?.name}
          </span>
        )
      case VALIDATED:
        return (
          <span className="text-success">
            {renderValidationIcon(VALIDATED)} Validated on{' '}
            {timeTag(uploadValidation.reviewedAt)} by{' '}
            {uploadValidation.reviewedBy?.name}
          </span>
        )
      default:
        return <span className="warning">Not validated</span>
    }
  }

  return (
    <li
      className={`list-group-item ${!uploadValidation ? 'text-warning' : ''}`}
    >
      <span className="fw-bold">Validation: </span>
      {displayValidationStatus()}
    </li>
  )
}

export default UploadValidationStatus
