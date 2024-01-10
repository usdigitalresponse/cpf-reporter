import type {
  FindOrganizationQuery,
  FindOrganizationQueryVariables,
} from 'types/graphql'

import { Label, SelectField } from '@redwoodjs/forms'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindOrganizationQuery($id: Int!) {
    organization: organization(id: $id) {
      id
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
      <Label
        name="reportingPeriodId"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Reporting Period
      </Label>
      <SelectField name="reportingPeriodId">
        {organization.reportingPeriods.map((reportingPeriod) => (
          <option key={reportingPeriod.id} value={reportingPeriod.id}>
            {reportingPeriod.name}
          </option>
        ))}
      </SelectField>
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
