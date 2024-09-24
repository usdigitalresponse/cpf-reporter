import { createColumnHelper } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

const columnHelper = createColumnHelper()

export const columnDefs = ({ certificationDisplay }) => [
  columnHelper.accessor('name', {
    header: 'Name',
    enableSorting: false,
  }),
  columnHelper.accessor('startDate', {
    cell: (info) => formatDateString(info.getValue()),
    header: 'Start Date',
  }),
  columnHelper.accessor('endDate', {
    cell: (info) => formatDateString(info.getValue()),
    header: 'End Date',
  }),
  columnHelper.accessor((row) => certificationDisplay(row), {
    id: 'certification',
    cell: (info) => info.getValue(),
    header: 'Certified At',
    enableSorting: false,
  }),
  columnHelper.accessor('id', {
    cell: (info) => (
      <Link
        to={routes.editReportingPeriod({ id: info.row.original.id })}
        title={'Edit reportingPeriod ' + info.row.original.id}
        className="rw-button rw-button-small rw-button-blue"
      >
        Edit
      </Link>
    ),
    header: '',
    enableSorting: false,
  }),
]
