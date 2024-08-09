// import type { FindSubrecipients } from 'types/graphql'

// import { Link, routes } from '@redwoodjs/router'
// import { useMutation } from '@redwoodjs/web'
// import { toast } from '@redwoodjs/web/toast'

// import { QUERY } from 'src/components/ReportingPeriod/ReportingPeriodsCell'
// import { timeTag, truncate } from 'src/lib/formatters'
import TableBuilder from 'src/components/TableBuilder/TableBuilder'

import { columnDefs } from './columns'

const Subrecipients = ({ subrecipients }) => {
  console.log('subrecipients:', subrecipients)
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
