import { createColumnHelper } from '@tanstack/react-table'
import type { Upload } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

const columnHelper = createColumnHelper()

function valueAsLink(cell): JSX.Element {
  const value = cell.getValue()

  return (
    <Link
      to={routes.upload({ id: value })}
      title={`Show upload ${value} detail`}
      className="link-underline link-underline-opacity-0"
    >
      {value}
    </Link>
  )
}

function validationDisplay(row) {
  const { latestValidation } = row
  const { results, passed, isManual, createdAt } = latestValidation

  if (!latestValidation || results === null) {
    return 'Not set'
  }

  const formattedDate = formatDateString(createdAt)

  if (!passed) {
    const invalidText = isManual
      ? `Invalidated on ${formattedDate}`
      : `Did not pass validation on ${formattedDate}`

    return <span className="text-danger">{invalidText}</span>
  }

  return formattedDate
}

export const columnDefs = [
  columnHelper.accessor('id', {
    cell: valueAsLink,
    header: 'ID',
  }),
  columnHelper.accessor('agency.code', {
    cell: (info) => info.getValue(),
    header: 'Agency',
  }),
  columnHelper.accessor((row: Upload) => row.expenditureCategory?.code, {
    cell: (info) => info.getValue() ?? 'Not set',
    header: 'EC Code',
  }),
  columnHelper.accessor('reportingPeriod.name', {
    cell: (info) => info.getValue(),
    header: 'Reporting Period',
  }),
  columnHelper.accessor('uploadedBy.email', {
    cell: (info) => info.getValue(),
    header: 'Uploaded By',
  }),
  columnHelper.accessor('filename', {
    cell: (info) => info.getValue(),
    header: 'Filename',
  }),
  {
    accessorFn: validationDisplay,
    cell: (info) => info.getValue(),
    id: 'createdAt',
    header: 'Validated?',
    enableSorting: false,
  },
]
