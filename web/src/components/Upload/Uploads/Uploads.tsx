import React from 'react'

import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
  const filterableInputs = [
    'id',
    'agency_code',
    'expenditureCategory_code',
    'uploadedBy_email',
    'filename',
  ]

  return (
    <TableBuilder
      data={uploads}
      columns={columnDefs}
      filterableInputs={filterableInputs}
    />
  )
}

export default UploadsList
