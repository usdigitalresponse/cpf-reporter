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
    const columnData = header.column

    return (
      <button
        className="btn btn-sort d-flex justify-content-between"
        onClick={columnData.getToggleSortingHandler()}
      >
        {!header.isPlaceholder &&
          flexRender(columnData.columnDef.header, header.getContext())}
        {columnData.getCanSort() && renderSortingIcon(columnData.getIsSorted())}
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

            {hasFilter && <Filter column={header.column} />}
          </th>
        )
      })}
    </tr>
  )
}

export default TableHeader
