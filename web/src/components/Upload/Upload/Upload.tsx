import { useState } from 'react'

import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationButtonGroup from '../UploadValidationButtonGroup/UploadValidationButtonGroup'
import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'
import UploadValidationStatus from '../UploadValidationStatus/UploadValidationStatus'

import * as validationJson from './testjson.json'
import { useMutation } from '@redwoodjs/web'
import { set } from '@redwoodjs/forms'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
  refetch: any
}

const FORCE_INVALIDATE_UPLOAD = gql`
  mutation forceInvalidateUploadMutation($id: Int!) {
    forceInvalidateUpload(id: $id) {
      id
    }
  }
`

const Upload = ({ upload, refetch }: Props) => {
  const [isValidating, setIsValidating] = useState(false)
  const [errors, setErrors] = useState([]) // validationErrors

  const [forceInvalidateUpload] = useMutation(FORCE_INVALIDATE_UPLOAD, {
    onCompleted: () => {
      console.log('Upload invalidated')
      refetch()
    },
    onError: (error) => {
     console.log('Couldnt invalidate the upload')
    },
  })


  // TODO: Implement download file function
  const downloadFile = () => {}

  // calls invalidate or validate
  const invalidateUploadTest = async () => {
    setIsValidating(true)

    // make a call to the backend to get invalidation results or validation results
    // backend saves a new upload validation record
    // this creates a new upload validation record


    // const newUploadValidation = {
    //   uploadId: upload.id,
    //   organizationId: upload.organizationId,
    //   reviewType: 'INVALIDATED',
    //   agencyId: upload.agency.id,
    //   inputTemplateId: 1, // TODO: Replace with actual input template id
    //   reviewResults: '{}',
    // }
    // onSave(newUploadValidation)

    setIsValidating(false)
  }

  // TODO: Implement invalidate upload function
  const invalidateUpload = async () => {
    setIsValidating(true)

    console.log('About to invalidate upload:', upload)
    await forceInvalidateUpload({ variables: { id: upload.id } })

    setIsValidating(false)
  }

  // Attempt to validate the upload, and if there are errors, display them
  const validateUpload = async () => {
    setIsValidating(true)

    try {
      // TODO: Implement validate upload function

      // Wait for the upload to be validated
      // validationResults will be a mutation
      // {
      // uploadId:
      // reviewResults: {}
      // }
      const validationResult = JSON.stringify(validationJson)
      const result = JSON.parse(validationResult)

      if (result.errors.length) {
        // !Cannot validate upload with errors
        // We got errors, display them but don't save the validation
        console.log('Cannot validate upload', errors)
        setErrors(result.errors)
      } else {
        // No errors, save the validation
        const newUploadValidation = {
          uploadId: upload.id,
          organizationId: upload.organizationId,
          reviewType: 'VALIDATED',
          agencyId: upload.agency.id,
          inputTemplateId: 1, // TODO: Replace with actual input template id
          reviewResults: result,
        }

        onSave(newUploadValidation)
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
