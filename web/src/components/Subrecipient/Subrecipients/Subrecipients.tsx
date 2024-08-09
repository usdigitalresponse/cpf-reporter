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
  const filterableInputs = ['id', 'ueiTinCombo']

  return (
    <TableBuilder
      data={subrecipients}
      columns={columnDefs}
      filterableInputs={filterableInputs}
    />
  )

  // return (
  //   <div className="rw-segment rw-table-wrapper-responsive">
  //     <table className="rw-table">
  //       <thead>
  //         <tr>
  //           <th>Id</th>
  //           <th>Name</th>
  //           <th>Start date</th>
  //         </tr>
  //       </thead>
  //       <tbody></tbody>
  //     </table>
  //   </div>
  // )
}

export default Subrecipients
