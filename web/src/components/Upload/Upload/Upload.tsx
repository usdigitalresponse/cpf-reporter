import { useState, useEffect } from 'react'

import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationButtonGroup from '../UploadValidationButtonGroup/UploadValidationButtonGroup'
import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'
import UploadValidationStatus from '../UploadValidationStatus/UploadValidationStatus'

import * as validationJson from './testjson.json'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
}

const Upload = ({ upload }: Props) => {
  // After loading the upload, we want to check for the latest validation

  useEffect(() => {
    const lastValidation = getLastValidation(currentUpload)
    setLastValidation(lastValidation)

    // TODO: Parse incoming JSON into a JS array
    // const errors = lastValidation?.invalidationResults
    //   ? JSON.parse(lastValidation?.invalidationResults)
    //   : []

    // setErrors(JSON.parse(data.data))

    const validationResult = JSON.stringify(validationJson)
    const result = JSON.parse(validationResult)

    if (result.errors.length) {
      setErrors(result.errors)
    }
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

  // Attempt to validate the upload, and if there are errors, display them
  const validateUpload = async () => {
    setIsValidating(true)

    try {
      // TODO: Implement validate upload function
      // const validationResult = await post(`/api/uploads/${upload.id}/validate`)
      const validationResult = JSON.stringify(validationJson)
      const result = JSON.parse(validationResult)

      if (result.errors.length) {
        console.log('Cannot validate upload', errors)
        setErrors(result.errors)
      } else {
        console.log('Upload successfully validated!')
      }
    } catch (error) {
      console.log('Validate upload error')
    }

    setIsValidating(false)
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
            <UploadValidationStatus uploadValidation={lastValidation} />
            <UploadValidationButtonGroup
              latestValidation={lastValidation}
              validateUpload={validateUpload}
              invalidateUpload={invalidateUpload}
            />
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload
