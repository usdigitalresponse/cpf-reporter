import type {
  FindOrganizationQuery,
  FindOrganizationQueryVariables,
} from 'types/graphql'

import { Label, SelectField, HiddenField } from '@redwoodjs/forms'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

export const beforeQuery = () => {
  // https://redwoodjs.com/docs/7.4/cells#beforequery
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useAuth()

  return {
    variables: { organizationId: currentUser.agency.organizationId },
  }
}
export const QUERY = gql`
  query FindOrganizationQuery($organizationId: Int!) {
    organization: organization(id: $organizationId) {
      id
      preferences
    }
    agencies: agenciesAvailableForUpload {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindOrganizationQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  organization,
  agencies,
}: CellSuccessProps<FindOrganizationQuery, FindOrganizationQueryVariables>) => {
  const { currentUser } = useAuth()

  return (
    <div>
      {/* Hard-coding the reporting period name temporarily. Will be resolved by issue #79 */}
      <Label name="reportingPeriodId" className="rw-label">
        Reporting Period - April 1st to June 30th - Q2 2024
      </Label>
      <HiddenField
        name="reportingPeriodId"
        value={organization.preferences.current_reporting_period_id}
      />
      <Label
        name="agencyId"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Agency Code
      </Label>
      <SelectField
        name="agencyId"
        defaultValue={currentUser.agencyId}
        className="form-select"
      >
        {agencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </SelectField>
    </div>
  )
}
