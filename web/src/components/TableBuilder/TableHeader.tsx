import { flexRender } from '@tanstack/react-table'

const TableHeader = ({
  headerGroup,
  filters,
  filterableInputs,
  handleFilterChange,
}) => {
  const renderSortingIcon = (sortDirection: 'asc' | 'desc' | null) => {
    const iconMapping = {
      asc: 'bi-arrow-up',
      desc: 'bi-arrow-down',
      inactive: 'bi-arrow-down-up inactive',
    }

    const iconClass = sortDirection
      ? iconMapping[sortDirection]
      : iconMapping['inactive']

    return <i className={`bi ${iconClass} ms-1`} />
  }

  const createColumnHeader = (header) => {
    return (
      <button
        className="btn btn-sort d-flex justify-content-between"
        onClick={header.column.getToggleSortingHandler()}
      >
        {!header.isPlaceholder &&
          flexRender(header.column.columnDef.header, header.getContext())}
        {renderSortingIcon(header.column.getIsSorted())}
      </button>
    )
  }

  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th key={header.id} className="border" colSpan={header.colSpan}>
          {createColumnHeader(header)}
          {/* {console.log('Header def', header.column)} */}

          {filterableInputs.includes(header.id.toString()) && (
            <input
              className="form-control form-control-sm my-2"
              onChange={handleFilterChange(header.id.toString())}
              value={filters[header.id.toString()] || ''}
            />
          )}
        </th>
      ))}
    </tr>
  )
}

export default TableHeader
