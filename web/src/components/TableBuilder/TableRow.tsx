import { flexRender } from '@tanstack/react-table'

const TableRow = ({ row }) => {
  return (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => {
        const cellProps =
          typeof cell.column.columnDef.meta?.getCellProps === 'function'
            ? cell.column.columnDef.meta.getCellProps(cell)
            : {}

        cellProps.className = `${cellProps.className || ''
          } border border-slate-700`
        return (
          <td key={cell.id} {...cellProps}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        )
      })}
    </tr>
  )
}

export default TableRow
