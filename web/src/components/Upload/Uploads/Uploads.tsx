import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import Table from 'react-bootstrap/Table'
import type { FindUploads } from 'types/graphql'

import { columnDefs } from './columns'

const UploadsList = ({ uploads }: FindUploads) => {
  const data = React.useMemo(() => uploads, [uploads])

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])

  const tableInstance = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
  })

  const createColumnHeader = (header) => {
    const renderIcon = (sortDirection: 'asc' | 'desc' | null) => {
      const iconMapping = {
        asc: 'bi-arrow-up',
        desc: 'bi-arrow-down',
        inactive: 'bi-arrow-down-up inactive',
      }

      const iconClass = sortDirection
        ? iconMapping[sortDirection]
        : iconMapping['inactive']

      const classNames = `bi ${iconClass} me-1`

      return (
        <span>
          <i className={classNames}></i>
        </span>
      )
    }

    return (
      <th
        key={header.id}
        className="border"
        colSpan={header.colSpan}
        onClick={header.column.getToggleSortingHandler()}
      >
        {renderIcon(header.column.getIsSorted())}
        {!header.isPlaceholder &&
          flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    )
  }

  return (
    <div>
      <Table striped borderless>
        <thead>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => createColumnHeader(header))}
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
