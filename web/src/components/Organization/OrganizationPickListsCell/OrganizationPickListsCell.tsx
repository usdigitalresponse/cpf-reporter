import type {
  FindOrganizationQuery,
  FindOrganizationQueryVariables,
} from 'types/graphql'

import { Label, SelectField, HiddenField } from '@redwoodjs/forms'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindOrganizationQuery($id: Int!) {
    organization: organization(id: $id) {
      id
      preferences
      reportingPeriods {
        id
        name
      }
      agencies {
        id
        name
      }
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
}: CellSuccessProps<FindOrganizationQuery, FindOrganizationQueryVariables>) => {
  return (
    <div>
      <HiddenField name="reportingPeriodId" value={organization.preferences.current_reporting_period_id} />
      <Label
        name="agencyId"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Agency Code
      </Label>
      <SelectField name="agencyId">
        {organization.agencies.map((agency) => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </SelectField>
    </div>
  )
}
