import React from 'react'

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

import DebouncedInput from 'src/components/Upload/Uploads/DebouncedInput'

import { columnDefs } from './columns'

const Filter = ({ column, table }: any) => {
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <p>{column.name}</p>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={column.name}
        className=""
        list={column.id + 'list'}
      />
    </>
  )
}

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
          <i className={classNames} />
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
              {headerGroup.headers.map((header: any) => {
                // Always create the column header
                const columnHeaderElement = createColumnHeader(header)

                // Conditionally create the filter element
                const filterElement = header.column.getCanFilter() ? (
                  <div key={`filter-${header.id}`}>
                    <Filter column={header.column} table={tableInstance} />
                  </div>
                ) : null

                // Return a fragment containing both the column header and the filter element (if applicable)
                return (
                  <React.Fragment key={header.id}>
                    {columnHeaderElement}
                    {filterElement}
                  </React.Fragment>
                )
              })}
            </tr>
          ))}

          {/* Working but 2 loops */}
          {/* {tableInstance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return createColumnHeader(header)
              })}

              {headerGroup.headers.map((header: any) =>
                header.column.getCanFilter() ? (
                  <div key={header.id}>
                    <Filter column={header.column} table={tableInstance} />
                  </div>
                ) : null
              )}
            </tr>
            
          ))} */}
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
