import { useState } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table'
import { Button, Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

import TableHeader from './TableHeader'
import TableRow from './TableRow'

/*
  This component uses TanStack Table to add filtering
  and sorting functionality.
  For documentation, visit: https://tanstack.com/table/v8/docs/introduction
*/

interface GlobalFilter {
  label: string
  checked: boolean
  loading?: boolean
  onChange: () => void
}

interface TableBuilderProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  filterableInputs?: string[]
  globalFilter?: GlobalFilter
}

function TableBuilder<T extends object>({
  data,
  columns,
  filterableInputs = [],
  globalFilter,
}: TableBuilderProps<T>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState([])

  const table = useReactTable<T>({
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

  const resetFilters = () => {
    table.resetColumnFilters()
    if (globalFilter) {
      globalFilter.onChange()
    }
  }

  const renderTableBody = () => {
    const rows = table.getRowModel().rows

    if (!rows.length) {
      return (
        <tr className="border">
          <td colSpan={100} className="text-center py-4">
            <span className="text-muted">No results found</span>
          </td>
        </tr>
      )
    }

    return rows.map((row) => <TableRow row={row} key={row.id} />)
  }

  return (
    <div className="pt-2">
      <Table striped borderless>
        <thead>
          {(!!filterableInputs.length || globalFilter) && (
            <tr className="border">
              <td colSpan={100} className="text-end pe-2">
                <div className="d-inline-flex align-items-center gap-3">
                  {globalFilter && (
                    <Form.Check
                      type="checkbox"
                      id="treasury-files-filter"
                      label={globalFilter.label}
                      checked={globalFilter.checked}
                      onChange={globalFilter.onChange}
                      disabled={globalFilter.loading}
                      className="mb-0"
                    />
                  )}
                  <Button
                    className="btn btn-secondary"
                    size="sm"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                </div>
              </td>
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
        <tbody>{renderTableBody()}</tbody>
      </Table>
    </div>
  )
}

export default TableBuilder
