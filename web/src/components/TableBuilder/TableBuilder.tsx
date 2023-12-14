import { useState } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

import TableHeader from './TableHeader'
import TableRow from './TableRow'

/*
  This component uses TanStack Table to add filtering
  and sorting functionality.
  For documentation, visit: https://tanstack.com/table/v8/docs/guide/introduction
*/
function TableBuilder({ data, columns, filterableInputs = [] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState([])

  const table = useReactTable({
    data,
    columns: columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const resetColumnFilters = () => {
    table.resetColumnFilters()
  }

  return (
    <div className="p-2">
      <Table striped borderless>
        <thead>
          {!!filterableInputs.length && (
            <tr className="border">
              <th className="text-end" colSpan={100}>
                <Button
                  className="btn btn-secondary"
                  size="sm"
                  onClick={resetColumnFilters}
                >
                  Reset filters
                </Button>
              </th>
            </tr>
          )}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader
              key={headerGroup.id}
              headerGroup={headerGroup}
              filterableInputs={filterableInputs}
            />
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow row={row} key={row.id} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default TableBuilder
