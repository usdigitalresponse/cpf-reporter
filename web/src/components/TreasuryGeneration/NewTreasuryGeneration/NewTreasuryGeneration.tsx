import type { NewTreasuryGenerationInput } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NewTreasuryGenerationForm from 'src/components/TreasuryGeneration/NewTreasuryGenerationForm/NewTreasuryGenerationForm'

const KICK_OFF_TREASURY_REPORT_GENERATION_MUTATION = gql`
  mutation KickOffTreasuryReportGeneration(
    $input: NewTreasuryGenerationInput!
  ) {
    kickOffTreasuryReportGeneration(input: $input) {
      response
    }
  }
`

const NewTreasuryGeneration = () => {
  const [newTreasuryGeneration, { loading, error }] = useMutation(
    KICK_OFF_TREASURY_REPORT_GENERATION_MUTATION,
    {
      onCompleted: (data) => {
        toast.success(
          `New Treasury Generation Kicked-off with response ${JSON.stringify(
            data
          )}`
        )
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: NewTreasuryGenerationInput) => {
    newTreasuryGeneration({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Add Treasury Generation
        </h2>
      </header>
      <div className="rw-segment-main">
        <NewTreasuryGenerationForm
          onSave={onSave}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}

export default NewTreasuryGeneration
