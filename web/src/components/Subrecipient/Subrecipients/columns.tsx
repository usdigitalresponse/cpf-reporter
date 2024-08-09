import { createColumnHelper } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

const columnHelper = createColumnHelper()

export const columnDefs = [
  columnHelper.accessor('ueiTinCombo', {
    cell: (info) => info.getValue(),
    header: 'ueiTinCombo',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => info.getValue(),
    header: 'Created Date',
  }),
  columnHelper.accessor('updatedAt', {
    cell: (info) => info.getValue(),
    header: 'Last Updated Date',
  }),
  //   columnHelper.accessor('expenditureCategory.code', {
  //     cell: (info) => info.getValue() ?? 'Not set',
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
]
