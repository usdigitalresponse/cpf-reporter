import { flexRender } from '@tanstack/react-table'

const TableRow = ({ row }) => {
  return (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="border border-slate-700">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}

export default TableRow
