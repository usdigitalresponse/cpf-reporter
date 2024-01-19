import { useState, useEffect } from 'react'

import { Button } from 'react-bootstrap'
import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'

import * as data from './testjson.json'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
}

const Upload = ({ upload }: Props) => {
  console.log(upload)
  // After loading the upload, we want to check for the latest validation
  useEffect(() => {
    const lastValidation = getLastValidation(currentUpload)
    setLastValidation(lastValidation)

    // TODO: Parse incoming JSON into a JS array
    // const errors = lastValidation?.invalidationResults
    //   ? JSON.parse(lastValidation?.invalidationResults)
    //   : []

    // setErrors(JSON.parse(data.data))
    const errorsString = JSON.stringify(data)
    const errors = JSON.parse(errorsString)
    setErrors(errors.data)

    // loadUpload()
  }, [])

  const [currentUpload, setCurrentUpload] = useState(upload)
  const [isValidating, setIsValidating] = useState(false) // loading state
  const [errors, setErrors] = useState([]) // validationErrors
  const [lastValidation, setLastValidation] = useState(null)

  function getLaterValidation(validation1, validation2) {
    const date1 = validation1.reviewedAt
    const date2 = validation2.reviewedAt

    if (!date1) return validation2
    if (!date2) return validation1
    return date1 > date2 ? validation1 : validation2
  }

  const getLastValidation = (currentUpload) => {
    let latestReviewedValidation = null

    currentUpload.validations.forEach((validation) => {
      if (!latestReviewedValidation) {
        latestReviewedValidation = validation
      } else if (validation.reviewedAt) {
        latestReviewedValidation = getLaterValidation(
          latestReviewedValidation,
          validation
        )
      }
    })

    return latestReviewedValidation
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

  const displayValidationStatus = () => {
    console.log(lastValidation)
    if (lastValidation?.reviewType === 'INVALIDATED') {
      return (
        <span className="text-danger">
          <i className="bi bi-x-circle-fill"></i> Invalidated on{' '}
          {timeTag(lastValidation.reviewedAt)} by{' '}
          {lastValidation.reviewedBy?.name}
        </span>
      )
    } else if (lastValidation?.reviewType === 'VALIDATED') {
      return (
        <span className="text-success">
          <i className="bi bi-check-lg"></i> Validated on{' '}
          {timeTag(lastValidation.reviewedAt)} by{' '}
          {lastValidation.reviewedBy?.name}
        </span>
      )
    } else {
      return <span className="text-warning">Not validated</span>
    }
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
