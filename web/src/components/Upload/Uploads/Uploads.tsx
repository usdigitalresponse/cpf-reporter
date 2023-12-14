import React from 'react'

import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
  function toDateOrNull(dateString) {
    return dateString ? new Date(dateString) : null
  }

  function getLaterDate(date1, date2) {
    if (!date1) return date2
    if (!date2) return date1
    return date1 > date2 ? date1 : date2
  }

  /*
    Returns an object that either contains the latest validation date or the latest invalidation date
    (depending which validation date is later) or an empty object if no dates are found
  */
  function findLatestValidationEntry(upload) {
    let latestInvalidationDate = null
    let latestValidationDate = null

    upload.validations.forEach((validation) => {
      const invalidatedDate = toDateOrNull(validation.invalidatedAt)
      const validatedDate = toDateOrNull(validation.validatedAt)

      latestInvalidationDate = getLaterDate(
        latestInvalidationDate,
        invalidatedDate
      )
      latestValidationDate = getLaterDate(latestValidationDate, validatedDate)
    })

    if (!latestInvalidationDate && !latestValidationDate) {
      return {} // Return an empty object if no dates are found
    }

    const isInvalidationLatest = latestInvalidationDate > latestValidationDate

    return {
      invalidatedAt: isInvalidationLatest ? latestInvalidationDate : null,
      validatedAt: isInvalidationLatest ? null : latestValidationDate,
    }
  }

  const uploadsWithValidationDates = uploads.map((upload) => {
    const latestValidation = findLatestValidationEntry(upload)
    return {
      ...upload,
      latestValidation,
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
