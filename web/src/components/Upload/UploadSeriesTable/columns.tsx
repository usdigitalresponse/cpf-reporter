import { createColumnHelper } from '@tanstack/react-table'

import { valueAsLink, validationDisplay } from '../Uploads/columns'

import { UploadSeriesRow } from './UploadSeriesTable'

const columnHelper = createColumnHelper<UploadSeriesRow>()
const getCellProps = (info) => {
  return {
    className: info.row.original._isFirstValid ? 'table-success' : '',
  }
}

export const columnDefs = [
  columnHelper.accessor('id', {
    cell: (info) => {
      const row = info.row.original

      return row._isCurrentUpload
        ? `${info.getValue()} (this upload)`
        : valueAsLink(info)
    },
    header: 'ID',
    enableSorting: false,
    meta: {
      getCellProps,
    },
  }),
  {
    accessorFn: validationDisplay,
    cell: (cell) => cell.getValue(),
    id: 'createdAt',
    header: 'Validated?',
    enableSorting: false,
    meta: {
      getCellProps,
    },
  },
]
