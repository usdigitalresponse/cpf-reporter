import { useState, useEffect } from 'react'

import { Button } from 'react-bootstrap'
import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
}

const Upload = ({ upload }: Props) => {
  const errorsMock = [
    {
      severity: null,
      message: 'EC Code must be set',
      tab: 'Cover',
      row: 1,
      col: 'B',
    },
    {
      severity: 'err',
      message:
        'Upload template version is older than the latest input template',
      tab: 'Logic',
      row: 2,
      col: 'D',
    },
  ]

  useEffect(() => {
    // This function relies on invalidatedAt and validatedAt being set
    const validation = getLastValidation(currentUpload)
    console.log(validation)
    // loadUpload()
  }, [])

  const [currentUpload, setCurrentUpload] = useState(upload)
  const [isValidating, setIsValidating] = useState(false) // loading state
  const [errors, setErrors] = useState(errorsMock) // validationErrors

  function toDateOrNull(dateString) {
    return dateString ? new Date(dateString) : null
  }

  function getLaterDate(date1, date2) {
    if (!date1) return date2
    if (!date2) return date1
    return date1 > date2 ? date1 : date2
  }

  const getLastValidation = (currentUpload) => {
    let latestReviewedDate = null

    currentUpload.validations.forEach((validation) => {
      const reviewedDate = toDateOrNull(validation.reviewedAt)

      latestReviewedDate = getLaterDate(latestReviewedDate, reviewedDate)
    })

    return latestReviewedDate
  }

  // TODO: Implement load upload function
  const loadUpload = async () => {
    // setCurrentUpload(null)
    // setErrors([])
    // const result = await getJson(`/api/uploads/${upload.id}`)
    // if (result.error) {
    //   console.log('Load upload error')
    // } else {
    //   setCurrentUpload(result.upload)
    // }
  }

  // TODO: Implement invalidate upload function
  const invalidateUpload = async () => {
    console.log('invalid')

    // setIsValidating(true)

    // try {
    //   const result = await post(`/api/uploads/${upload.id}/invalidate`)
    //   await loadUpload()

    //   if (result.errors?.length) {
    //     setErrors(result.errors)
    //   } else {
    //     console.log('Upload successfully invalidated!')
    //   }
    // } catch (error) {
    //   // we got an error from the backend, but the backend didn't send reasons
    //   console.log('invalidate upload error')
    // }

    // setIsValidating(false)
  }

  const validateUpload = async () => {
    // console.log('valid')
    // setIsValidating(true)
    // try {
    //   const result = await post(`/api/uploads/${upload.id}/validate`)
    //   await loadUpload()
    //   if (result.errors?.length) {
    //     setErrors(result.errors)
    //   } else {
    //     console.log('Upload successfully validated!')
    //   }
    // } catch (error) {
    //   console.log('Validate upload error')
    // }
    // setIsValidating(false)
  }

  // const getValidatedLiClass = () => {
  //   if (!upload) return {}

  //   return {
  //     'text-success':
  //       (upload.validated_at && !upload.invalidated_at) ||
  //       upload.validated_at > upload.invalidated_at,
  //     'text-warning': !upload.validated_at && !upload.invalidated_at,
  //     'text-danger': upload.invalidated_at,
  //   }
  // }

  return (
    <>
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Upload {upload.id} details:
        </h2>
      </header>

      {errors.length > 0 && <UploadValidationResultsTable errors={errors} />}

      <div className="row">
        <div className="col">
          <ul className="list-group">
            <li className="list-group-item">
              <span className="fw-bold">Filename: </span>
              {upload.filename}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Reporting period: </span>
              {upload.reportingPeriod.name}
            </li>
            <li
              className={`list-group-item ${
                !upload.expenditureCategory.code && 'list-group-item-warning'
              }`}
            >
              <span className="fw-bold">EC Code: </span>
              {upload.expenditureCategory.code || 'Not set'}
            </li>
            <li
              className={`list-group-item ${
                !upload.agency.code && 'list-group-item-warning'
              }`}
            >
              <span className="fw-bold">Agency: </span>
              {upload.agency.code || 'Not set'}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Created: </span>
              {timeTag(upload.createdAt)} by {upload.uploadedBy.name}
            </li>
            <li
              className={`list-group-item ${
                !upload.notes && 'list-group-item-warning'
              }`}
            >
              <span className="fw-bold">Notes: </span>
              {upload.notes || 'Not set'}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Validation: </span>
              {displayValidationStatus()}
            </li>
            <li className="list-group-item">
              <div className="float-end">
                <Button variant="primary" size="sm">
                  Download file
                </Button>{' '}
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
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload
