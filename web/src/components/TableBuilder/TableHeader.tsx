import { flexRender } from '@tanstack/react-table'

import Filter from './Filter'

const TableHeader = ({ headerGroup, filterableInputs }) => {
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
      {headerGroup.headers.map((header) => {
        const hasFilter =
          filterableInputs.includes(header.id.toString()) &&
          header.column.getCanFilter()

        return (
          <th
            key={header.id}
            className={`border ${!hasFilter ? 'align-top' : ''}`}
            colSpan={header.colSpan}
          >
            {createColumnHeader(header)}

            {hasFilter ? (
              <div>
                <Filter column={header.column} />
              </div>
            ) : null}
          </th>
        )
      })}
    </tr>
  )
}

export default TableHeader
