import type {
  DeleteReportingPeriodMutationVariables,
  FindReportingPeriodById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag, timeTag } from 'src/lib/formatters'

const DELETE_REPORTING_PERIOD_MUTATION = gql`
  mutation DeleteReportingPeriodMutation($id: Int!) {
    deleteReportingPeriod(id: $id) {
      id
    }
  }
`

interface Props {
  reportingPeriod: NonNullable<FindReportingPeriodById['reportingPeriod']>
}

const ReportingPeriod = ({ reportingPeriod }: Props) => {
  const [deleteReportingPeriod] = useMutation(
    DELETE_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('ReportingPeriod deleted')
        navigate(routes.reportingPeriods())
      },
      onError: (error) => {
        toast.error(error.message)
      },
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
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            ReportingPeriod {reportingPeriod.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{reportingPeriod.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{reportingPeriod.name}</td>
            </tr>
            <tr>
              <th>Start date</th>
              <td>{timeTag(reportingPeriod.startDate)}</td>
            </tr>
            <tr>
              <th>End date</th>
              <td>{timeTag(reportingPeriod.endDate)}</td>
            </tr>
            <tr>
              <th>Input template id</th>
              <td>{reportingPeriod.inputTemplateId}</td>
            </tr>
            <tr>
              <th>Output template id</th>
              <td>{reportingPeriod.outputTemplateId}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(reportingPeriod.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(reportingPeriod.updatedAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editReportingPeriod({ id: reportingPeriod.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(reportingPeriod.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default ReportingPeriod
