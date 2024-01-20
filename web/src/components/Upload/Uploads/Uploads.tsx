import React from 'react'

import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
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

  const uploadsWithLatestValidation = uploads.map((upload) => {
    return {
      ...upload,
      latestValidation: getLastValidation(upload),
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
      data={uploadsWithLatestValidation}
      columns={columnDefs}
      filterableInputs={filterableInputs}
    />
  )
}

export default UploadsList
