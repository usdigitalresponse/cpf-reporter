import { useMemo, useState } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Button } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

import TableHeader from './TableHeader'
import TableRow from './TableRow'

function TableBuilder({ data, columns, filterableInputs = [] }) {
  const [filters, setFilters] = useState({})
  const [sorting, setSorting] = React.useState([])

  const filteredData = useMemo(() => {
    if (!filterableInputs) return data

    return data.filter((row) =>
      filterableInputs.every((input) => {
        console.log('Row', row)

        let value = ''

        // if (typeof input === 'function') {
        //   value = input(row)
        // }
        // else {

        const rawValue = row[input]
        // Check if the value is not undefined and is a string or can be converted to a string
        value =
          typeof rawValue === 'string' || typeof rawValue === 'number'
            ? rawValue.toString()
            : ''

        // console.log(value.includes(filters[input.toString()]))
        // Check if value is not undefined before calling .toString()
        return value.includes(filters[input.toString()] || '')
      })
    )
  }, [data, filters, filterableInputs])

  const table = useReactTable({
    data: filteredData,
    columns: columns,
    state: {
      sorting,
      // columnFilters, // should be used
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleFilterChange =
    (accessor: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [accessor]: e.target.value })
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
                  // onClick={resetColumnFilters()}
                >
                  Reset filters
                </Button>
              </th>
            </tr>
          )}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader
              headerGroup={headerGroup}
              key={headerGroup.id}
              filters={filters}
              filterableInputs={filterableInputs}
              handleFilterChange={handleFilterChange}
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
