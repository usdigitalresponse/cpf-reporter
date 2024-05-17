import type {
  DeleteReportingPeriodMutationVariables,
  FindReportingPeriods,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/ReportingPeriod/ReportingPeriodsCell'
import { checkboxInputTag, timeTag, truncate } from 'src/lib/formatters'

const DELETE_REPORTING_PERIOD_MUTATION = gql`
  mutation DeleteReportingPeriodMutation($id: Int!) {
    deleteReportingPeriod(id: $id) {
      id
    }
  }
`

const ReportingPeriodsList = ({ reportingPeriods }: FindReportingPeriods) => {
  const [deleteReportingPeriod] = useMutation(
    DELETE_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('ReportingPeriod deleted')
      },
      onError: (error) => {
        toast.error(error.message)
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const onDeleteClick = (id: DeleteReportingPeriodMutationVariables['id']) => {
    if (
      confirm('Are you sure you want to delete reportingPeriod ' + id + '?')
    ) {
      deleteReportingPeriod({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Input template id</th>
            <th>Output template id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {reportingPeriods.map((reportingPeriod) => (
            <tr key={reportingPeriod.id}>
              <td>{truncate(reportingPeriod.id)}</td>
              <td>{truncate(reportingPeriod.name)}</td>
              <td>{timeTag(reportingPeriod.startDate)}</td>
              <td>{timeTag(reportingPeriod.endDate)}</td>
              <td>{truncate(reportingPeriod.inputTemplateId)}</td>
              <td>{truncate(reportingPeriod.outputTemplateId)}</td>
              <td>{timeTag(reportingPeriod.createdAt)}</td>
              <td>{timeTag(reportingPeriod.updatedAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.reportingPeriod({ id: reportingPeriod.id })}
                    title={
                      'Show reportingPeriod ' + reportingPeriod.id + ' detail'
                    }
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editReportingPeriod({ id: reportingPeriod.id })}
                    title={'Edit reportingPeriod ' + reportingPeriod.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete reportingPeriod ' + reportingPeriod.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(reportingPeriod.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportingPeriodsList
