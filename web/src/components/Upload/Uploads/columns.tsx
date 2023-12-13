import { createColumnHelper } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

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

// export const columnDefs = [
//   columnHelper.accessor('id', {
//     cell: valueAsLink,
//     header: 'ID',
//   }),
//   columnHelper.accessor('agency.code', {
//     cell: (info) => info.getValue(),
//     header: 'Agency',
//   }),
//   columnHelper.accessor('expenditureCategory.code', {
//     cell: (info) => info.getValue(),
//     header: 'EC Code',
//   }),
//   columnHelper.accessor('uploadedBy.email', {
//     cell: (info) => info.getValue(),
//     header: 'Uploaded By',
//   }),
//   columnHelper.accessor('filename', {
//     cell: (info) => info.getValue(),
//     header: 'Filename',
//   }),
//   columnHelper.accessor('validated_at', {
//     cell: (info) => info.getValue(),
//     header: 'Validated?',
//   }),
// ]

export const columnDefs = [
  {
    accessorKey: 'id',
    cell: valueAsLink,
    header: () => <span>ID</span>,
  },
  {
    accessorFn: (row) => row.agency.code,
    id: 'agency_code',
    cell: (info) => info.getValue(),
    header: () => <span>Agency</span>,
  },
  {
    accessorFn: (row) => row.agency.code,
    id: 'agency.code',
    cell: (info) => info.getValue(),
    header: () => <span>Agency.Code</span>,
  },
  // {
  //   accessorFn: (row) => row.agency.code,
  //   id: "Agency",
  //   cell: (info) => info.getValue(),
  //   header: () => <span>Agency</span>,
  // },

  // columnHelper.accessor('expenditureCategory.code', {
  //   cell: (info) => info.getValue(),
  //   header: 'EC Code',
  // }),
  // columnHelper.accessor('uploadedBy.email', {
  //   cell: (info) => info.getValue(),
  //   header: 'Uploaded By',
  // }),
  columnHelper.accessor('filename', {
    cell: (info) => info.getValue(),
    header: 'Filename',
  }),
  // columnHelper.accessor('validated_at', {
  //   cell: (info) => info.getValue(),
  //   header: 'Validated?',
  // }),
]
