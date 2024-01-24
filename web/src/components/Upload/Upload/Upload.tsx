import { useState } from 'react'

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
  const [isValidating, setIsValidating] = useState(false)
  const [errors, setErrors] = useState([]) // validationErrors

  // TODO: Implement download file function
  const downloadFile = () => {}

  // TODO: Implement invalidate upload function
  const invalidateUpload = async () => {
    setIsValidating(true)
    console.log('Waiting 2 seconds to invalidate upload...')

    setTimeout(() => {
      setIsValidating(false)
    }, 2000)

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
      {errors.length > 0 && <UploadValidationResultsTable errors={errors} />}

      <h3>Upload {upload.id} details</h3>
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
            <UploadValidationStatus
              uploadValidation={upload.latestValidation}
            />
            <UploadValidationButtonGroup
              latestValidation={upload.latestValidation}
              validateUpload={validateUpload}
              invalidateUpload={invalidateUpload}
              isValidating={isValidating}
              downloadFile={downloadFile}
            />
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload
