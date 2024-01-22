import type { CreateReportingPeriodInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ReportingPeriodForm from 'src/components/ReportingPeriod/ReportingPeriodForm'

const CREATE_REPORTING_PERIOD_MUTATION = gql`
  mutation CreateReportingPeriodMutation($input: CreateReportingPeriodInput!) {
    createReportingPeriod(input: $input) {
      id
    }
  }
`

const NewReportingPeriod = () => {
  const [createReportingPeriod, { loading, error }] = useMutation(
    CREATE_REPORTING_PERIOD_MUTATION,
    {
      onCompleted: () => {
        toast.success('ReportingPeriod created')
        navigate(routes.reportingPeriods())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateReportingPeriodInput) => {
    createReportingPeriod({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New ReportingPeriod</h2>
      </header>
      <div className="rw-segment-main">
        <ReportingPeriodForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewReportingPeriod
