import React from 'react'

import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
  // Uploads.validations is an array that can contain both valid and invalid validations,
  // We store the latest valid and invalid entry
  function findLatestValidationAndInvalidationDatesFromUpload(upload) {
    let latestInvalidationDate = null
    let latestValidationDate = null

    upload.validations.forEach((validation) => {
      if (validation.invalidatedAt) {
        // Update latestInvalidationDate if it's null or if this date is more recent
        if (
          !latestInvalidationDate ||
          Date.parse(validation.invalidatedAt) >
            Date.parse(latestInvalidationDate)
        ) {
          latestInvalidationDate = validation.invalidatedAt
        }
      }

      if (validation.validatedAt) {
        // Update latestValidationDate if it's null or if this date is more recent
        if (
          !latestValidationDate ||
          Date.parse(validation.validationAt) > Date.parse(latestValidationDate)
        ) {
          latestValidationDate = validation.validatedAt
        }
      }
    })

    return { latestInvalidationDate, latestValidationDate }
  }

  const uploadsWithValidationDates = uploads.map((upload) => {
    return {
      ...upload,
      ...findLatestValidationAndInvalidationDatesFromUpload(upload),
    }
  })

  const filterableInputs = [
    'agency_code',
    'expenditureCategory_code',
    'uploadedBy_email',
    'filename',
  ]

  return (
    <TableBuilder
      data={uploadsWithValidationDates}
      columns={columnDefs}
      filterableInputs={filterableInputs}
    />
  )
}

export default UploadsList
