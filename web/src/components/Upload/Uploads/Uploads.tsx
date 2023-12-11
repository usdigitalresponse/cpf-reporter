import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import Table from 'react-bootstrap/Table'
import type { FindUploads } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

const UploadsList = ({ uploads }: FindUploads) => {
  const data = React.useMemo(() => uploads, [uploads])

  const [sorting, setSorting] = React.useState([])

  const columnHelper = createColumnHelper()

  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => {
        const id = info.getValue() as number

        return (
          <Link
            to={routes.upload({ id })}
            title={`Show upload ${info.getValue()} detail`}
          >
            {id}
          </Link>
        )
      },
      header: () => <span>ID</span>,
    }),
    columnHelper.accessor('agency.code', {
      cell: (info) => info.getValue(),
      header: () => <span>Agency</span>,
    }),
    columnHelper.accessor('expenditureCategory.code', {
      cell: (info) => info.getValue(),
      header: () => <span>EC Code</span>,
    }),
    columnHelper.accessor('uploadedBy.email', {
      cell: (info) => info.getValue(),
      header: () => <span>Uploaded By</span>,
    }),
    columnHelper.accessor('filename', {
      cell: (info) => info.getValue(),
      header: () => <span>Filename</span>,
    }),
    columnHelper.accessor('validated_at', {
      cell: (info) => info.getValue(),
      header: () => <span>Validated?</span>,
    }),
  ]

  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <div>
      <Table striped borderless>
        <thead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    className="border"
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {header.column.getIsSorted() === 'asc' ? (
                      <span> 🔼</span> // For ascending order
                    ) : header.column.getIsSorted() === 'desc' ? (
                      <span> 🔽</span> // For descending order
                    ) : null}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableInstance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default UploadsList
