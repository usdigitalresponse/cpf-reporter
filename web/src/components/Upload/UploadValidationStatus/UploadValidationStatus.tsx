import { timeTag } from 'src/lib/formatters'

const UploadValidationStatus = ({ latestValidation }) => {
  const getValidationIcon = (passed: boolean) => {
    const iconClass = passed ? 'bi bi-check-lg' : 'bi bi-x-circle-fill'
    return <i className={iconClass} />
  }

  const getValidationStatus = () => {
    const {
      passed,
      isManual,
      createdAt,
      results,
      initiatedBy: { name },
    } = latestValidation

    if (results === null) {
      return (
        <span className="text-warning fst-italic">
          Validation in progress...
        </span>
      )
    }

    const valueClassName = !passed ? 'text-danger' : 'text-success'
    const time = timeTag(createdAt)

    let statusOutcome
    if (isManual) {
      statusOutcome = 'Invalidated'
    } else {
      statusOutcome = passed ? 'Validated' : 'Did not pass validation'
    }

    const statusText = (
      <>
        {statusOutcome}
        {' on '}
        {time}
        {' by '}
        {name}
      </>
    )

    return (
      <span className={valueClassName}>
        {getValidationIcon(passed)} {statusText}
      </span>
    )
  }

  return (
    <li className="list-group-item">
      <span className="fw-bold">Validation: </span>
      {getValidationStatus()}
    </li>
  )
}

export default UploadValidationStatus
