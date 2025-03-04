import { createColumnHelper } from '@tanstack/react-table'
import type { FindReportingPeriodsWithCertification } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

const columnHelper =
  createColumnHelper<
    FindReportingPeriodsWithCertification['reportingPeriodsWithCertification']
  >()

export const columnDefs = ({ certificationDisplay, canEdit, isUSDRAdmin }) => {
  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      enableSorting: true,
    }),
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
  ]

  if (isUSDRAdmin) {
    columns.push(
      columnHelper.accessor('id', {
        id: 'actions',
        cell: (info) =>
          canEdit(info.row.original) ? (
            <Link
              to={routes.editReportingPeriod({ id: info.row.original.id })}
              title={'Edit reportingPeriod ' + info.row.original.id}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </Link>
          ) : null,
        header: 'Actions',
        enableSorting: false,
      })
    )
  }

  return columns
}
