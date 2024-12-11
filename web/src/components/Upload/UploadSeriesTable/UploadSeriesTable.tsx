import type { FindUploadById } from 'types/graphql'

import TableBuilder from 'src/components/TableBuilder/TableBuilder'
import { columnDefs } from 'src/components/Upload/UploadSeriesTable/columns'

export type UploadSeriesRow =
  FindUploadById['upload']['seriesUploads'][number] & {
    _isCurrentUpload: boolean
    _isFirstValid: boolean
  }

interface UploadSeriesTableProps {
  upload: FindUploadById['upload']
  seriesUploads: FindUploadById['upload']['seriesUploads']
}

const UploadSeriesTable = ({
  upload,
  seriesUploads,
}: UploadSeriesTableProps) => {
  const ecCode = upload.expenditureCategory?.code || 'Not set'
  const firstValid = seriesUploads.find(
    (upload) => upload.latestValidation?.passed
  )
  const formattedRows: UploadSeriesRow[] = seriesUploads.map((seriesUpload) => {
    return {
      ...seriesUpload,
      _isCurrentUpload: seriesUpload.id === upload.id,
      _isFirstValid: seriesUpload.id === firstValid?.id,
    }
  })

  return (
    <div>
      <h3 className="mb-2">
        Upload Series from{' '}
        <span className="text-primary">{upload.agency.code}</span>, EC Code{' '}
        <span className="text-primary">{ecCode}</span> in period{' '}
        <span className="text-primary">{upload.reportingPeriod?.name}</span>
      </h3>
      <div className="mb-2">
        {firstValid ? (
          'The upload highlighted in green will be used for Treasury Reporting.'
        ) : (
          <span>
            Agency <span className="text-primary">{upload.agency.code}</span>{' '}
            does not have a valid upload with code{' '}
            <span className="text-primary">{ecCode}</span> to use in Treasury
            reporting for{' '}
            <span className="text-primary">{upload.reportingPeriod?.name}</span>
          </span>
        )}
      </div>

      <div className="row">
        <div className="col-lg-6">
          <TableBuilder<UploadSeriesRow>
            data={formattedRows}
            columns={columnDefs}
          />
        </div>
      </div>
    </div>
  )
}

export default UploadSeriesTable
