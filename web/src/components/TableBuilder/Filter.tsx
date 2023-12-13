import DebouncedInput from './DebouncedInput'

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
    />
  )
}

export default Filter
