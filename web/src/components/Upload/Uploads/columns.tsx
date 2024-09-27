import { createColumnHelper } from '@tanstack/react-table'

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

  if (!latestValidation || latestValidation.results === null) {
    return 'Not set'
  }

  const { passed, createdAt } = latestValidation
  const formattedDate = formatDateString(createdAt)

  if (!passed) {
    return (
      <span className="text-danger">
        Did not pass validation on {formattedDate}
      </span>
    )
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
  columnHelper.accessor('expenditureCategory.code', {
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
