import type { FindUploads } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

interface UploadsListProps {
  uploads: FindUploads['uploads']
  showTreasuryFiles: boolean
  onTreasuryFilesChange: () => void
  isLoading?: boolean
}

const UploadsList = ({
  uploads,
  showTreasuryFiles,
  onTreasuryFilesChange,
  isLoading,
}: UploadsListProps) => {
  const filterableInputs = [
    'agency_code',
    'expenditureCategory_code',
    'uploadedBy_email',
    'filename',
    'reportingPeriod_name',
  ]

  return (
    <TableBuilder<FindUploads['uploads'][number]>
      data={uploads}
      columns={columnDefs}
      filterableInputs={filterableInputs}
      globalFilter={{
        label: 'Only Treasury Files',
        checked: showTreasuryFiles,
        onChange: onTreasuryFilesChange,
        loading: isLoading,
      }}
    />
  )
}

export default UploadsList
