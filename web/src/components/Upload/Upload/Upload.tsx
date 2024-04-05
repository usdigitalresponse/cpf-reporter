import { useState } from 'react'

import type { FindUploadById } from 'types/graphql'

import { timeTag } from 'src/lib/formatters'

import UploadValidationButtonGroup from '../UploadValidationButtonGroup/UploadValidationButtonGroup'
import UploadValidationResultsTable from '../UploadValidationResultsTable/UploadValidationResultsTable'
// import UploadValidationStatus from '../UploadValidationStatus/UploadValidationStatus'

import { useMutation } from '@redwoodjs/web'

enum Severity {
  Error = 'err',
  Warning = 'warn',
  Info = 'info',
}

interface ErrorInterface {
  severity: Severity
  message: string
  tab?: string
  row?: string
  col?: string
}

const errors: ErrorInterface[] = [
  {
    message: 'Upload template version is older than the latest input template',
    tab: 'Logic',
    row: '1',
    col: 'B',
    severity: Severity.Warning,
  },
  {
    message: 'EC code must be set',
    tab: 'Cover',
    row: '2',
    col: 'D',
    severity: Severity.Error,
  },
]

interface Props {
  upload: NonNullable<FindUploadById['upload']>
}

// const FORCE_INVALIDATE_UPLOAD = gql`
//   mutation forceInvalidateUploadMutation($id: Int!) {
//     forceInvalidateUpload(id: $id) {
//       id
//     }
//   }
// `

// const TRIGGER_UPLOAD_VALIDATION = gql`
//   mutation triggerUploadValidationMutation($id: Int!) {
//     triggerUploadValidation(id: $id) {
//       id
//     }
//   }
// `

const Upload = ({ upload }: Props) => {
  // const [isValidating, setIsValidating] = useState(false)

  console.log('Upload', upload)

  // TODO: Temporary data until we get the reviewResults from the backend
  // const hasErrors = Object.keys(errors).length
  
  const hasErrors = upload.latestValidation?.results !== null &&
    Array.isArray(upload.latestValidation?.results) &&
    upload.latestValidation?.results.length > 0;


  // Runs when the user clicks the "Invalidate" button
  // const [forceInvalidateUpload] = useMutation(FORCE_INVALIDATE_UPLOAD, {
  //   onCompleted: () => {
  //     console.log('Upload invalidated')
  //     refetchUpload()
  //   },
  //   onError: (error) => {
  //     console.log('Couldnt invalidate the upload')
  //   },
  // })

  // Runs when the user clicks the "Validate" or "Re-Validate" button
  // const [triggerUploadValidation] = useMutation(TRIGGER_UPLOAD_VALIDATION, {
  //   onCompleted: () => {
  //     console.log('Getting results of your validation')
  //     refetchUpload()
  //   },
  //   onError: (error) => {
  //     console.log('Couldn\'t run validation checks on the upload')
  //   },
  // })

  // TODO: Implement download file function
  const downloadFile = () => { }

  const reviewUpload = async () => {}

  const invalidateUpload = async () => {}

  return (
    <>
      {hasErrors && <UploadValidationResultsTable errors={errors} />}

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
              {upload.reportingPeriod?.name}
            </li>
            <li className='list-group-item'>
              <span className="fw-bold">Agency: </span>{upload.agency?.code}
            </li>
            <li
              className={`list-group-item ${!upload.expenditureCategory.code && 'list-group-item-warning'
                }`}
            >
              <span className="fw-bold">EC Code: </span>
              {upload.expenditureCategory.code || 'Not set'}
            </li>
            <li className="list-group-item">
              <span className="fw-bold">Created: </span>
              {timeTag(upload.createdAt)} by {upload.uploadedBy.name}
            </li>
            {/* <UploadValidationStatus
              uploadValidation={upload.latestValidation}
            /> */}
            {upload.latestValidation && (
              <UploadValidationButtonGroup
                latestValidation={upload.latestValidation}
                handleValidate={reviewUpload}
                handleForceInvalidate={invalidateUpload}
                handleFileDownload={downloadFile}
              />)
            }
          </ul>
        </div>
      </div>
    </>
  )
}

export default Upload