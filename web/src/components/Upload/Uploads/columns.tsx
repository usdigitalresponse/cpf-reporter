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
  const lastValidation = row.latestValidation

  if (!lastValidation) {
    return <span className="text-danger">Not set</span>
  }

  const formattedDate = formatDateString(lastValidation.reviewedAt)

  if (lastValidation?.reviewType === 'INVALIDATED') {
    return <span className="text-danger">Invalidated on {formattedDate}</span>
  }

  if (lastValidation?.reviewType === 'VALIDATED') {
    return <span>Validated on {formattedDate}</span>
  }
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
