import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const Subrecipients = ({ subrecipients }) => {
  const filterableInputs = ['uei', 'tin']

  return (
    <TableBuilder
      data={subrecipients}
      columns={columnDefs}
      filterableInputs={filterableInputs}
    />
  )
}

export default Subrecipients
