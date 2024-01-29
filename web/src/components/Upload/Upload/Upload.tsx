import { useState } from 'react'

import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationButtonGroup from '../UploadValidationButtonGroup/UploadValidationButtonGroup'
import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'
import UploadValidationStatus from '../UploadValidationStatus/UploadValidationStatus'

import * as validationJson from './testjson.json'
import { useMutation } from '@redwoodjs/web'

interface Props {
  upload: NonNullable<FindUploadById['upload']>
  refetchUpload: any
}

const FORCE_INVALIDATE_UPLOAD = gql`
  mutation forceInvalidateUploadMutation($id: Int!) {
    forceInvalidateUpload(id: $id) {
      id
    }
  }
`

const TRIGGER_UPLOAD_VALIDATION = gql`
  mutation triggerUploadValidationMutation($id: Int!) {
    triggerUploadValidation(id: $id) {
      id
    }
  }
`

const Upload = ({ upload, refetchUpload }: Props) => {
  const [isValidating, setIsValidating] = useState(false)

  // TODO: Temporary data until we get the reviewResults from the backend
  const hasErrors = Object.keys(validationJson).length

  // Runs when the user clicks the "Invalidate" button
  const [forceInvalidateUpload] = useMutation(FORCE_INVALIDATE_UPLOAD, {
    onCompleted: () => {
      console.log('Upload invalidated')
      refetchUpload()
    },
    onError: (error) => {
     console.log('Couldnt invalidate the upload')
    },
  })

  // Runs when the user clicks the "Validate" or "Re-Validate" button
  const [triggerUploadValidation] = useMutation(TRIGGER_UPLOAD_VALIDATION, {
    onCompleted: () => {
      console.log('Getting results of your validation')
      refetchUpload()
    },
    onError: (error) => {
     console.log('Couldn\'t run validation checks on the upload')
    },
  })

  // TODO: Implement download file function
  const downloadFile = () => {}

  // !WIP
  const reviewUpload = async () => {
    setIsValidating(true)

    // Make a call to the backend to get invalidation results or validation results
    // Backend creates a new upload validation record
    await triggerUploadValidation({ variables: { id: upload.id } })

    setIsValidating(false)
  }

  // !WIP
  const invalidateUpload = async () => {
    setIsValidating(true)

    console.log('About to invalidate upload:', upload)
    await forceInvalidateUpload({ variables: { id: upload.id } })

    setIsValidating(false)
  }

  return (
    <>
      {/* {upload?.reviewResults?.length > 0 && <UploadValidationResultsTable errors={upload?.reviewResults?} />} */}
      {hasErrors > 0 && <UploadValidationResultsTable errors={validationJson.default.data} />}

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
              validateUpload={reviewUpload}
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
