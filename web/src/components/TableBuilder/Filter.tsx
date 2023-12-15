import { useCallback } from 'react'

import DebouncedInput from './DebouncedInput'

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue()

  const handleInputChange = useCallback(
    (value) => {
      column.setFilterValue(value)
    },
    [column]
  )

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  )
}

export default Filter
