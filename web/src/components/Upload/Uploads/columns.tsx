import { createColumnHelper } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from '../../../utils/index'

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
  const validations = row.latestValidation

  if (validations.invalidatedAt) {
    const formattedDate = formatDateString(validations.invalidatedAt)
    return <span className="text-danger">Invalidated at {formattedDate}</span>
  }

  if (validations.validatedAt) {
    return formatDateString(validations.validatedAt)
  }

  // If neither date is available, display nothing or a default message
  return 'Not set'
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
    cell: (info) => info.getValue(),
    header: 'EC Code',
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
    id: 'validatedAt',
    header: 'Validated?',
    enableSorting: false,
  },
]
