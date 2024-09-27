import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
  const filterableInputs = [
    'agency_code',
    'expenditureCategory_code',
    'uploadedBy_email',
    'filename',
    'reportingPeriod_name',
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
