import type {
  EditReportingPeriodById,
  UpdateReportingPeriodInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ReportingPeriodForm from 'src/components/ReportingPeriod/ReportingPeriodForm'

export const QUERY = gql`
  query EditReportingPeriodById($id: Int!) {
    reportingPeriod: reportingPeriod(id: $id) {
      id
      name
      startDate
      endDate
      organizationId
      certifiedAt
      certifiedById
      inputTemplateId
      outputTemplateId
      isCurrentPeriod
      createdAt
      updatedAt
    }
  }
`
const UPDATE_REPORTING_PERIOD_MUTATION = gql`
  mutation UpdateReportingPeriodMutation(
    $id: Int!
    $input: UpdateReportingPeriodInput!
  ) {
    updateReportingPeriod(id: $id, input: $input) {
      id
      name
      startDate
      endDate
      organizationId
      certifiedAt
      certifiedById
      inputTemplateId
      outputTemplateId
      isCurrentPeriod
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  reportingPeriod,
}: CellSuccessProps<EditReportingPeriodById>) => {
  const [updateReportingPeriod, { loading, error }] = useMutation(
    UPDATE_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('ReportingPeriod updated')
        navigate(routes.reportingPeriods())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateReportingPeriodInput,
    id: EditReportingPeriodById['reportingPeriod']['id']
  ) => {
    updateReportingPeriod({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit ReportingPeriod {reportingPeriod?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <ReportingPeriodForm
          reportingPeriod={reportingPeriod}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
