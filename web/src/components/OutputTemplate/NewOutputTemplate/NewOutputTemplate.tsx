import type {
  CreateOutputTemplateMutation,
  CreateOutputTemplateInput,
  CreateOutputTemplateMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OutputTemplateForm from 'src/components/OutputTemplate/OutputTemplateForm'

const CREATE_OUTPUT_TEMPLATE_MUTATION: TypedDocumentNode<
  CreateOutputTemplateMutation,
  CreateOutputTemplateMutationVariables
> = gql`
  mutation CreateOutputTemplateMutation($input: CreateOutputTemplateInput!) {
    createOutputTemplate(input: $input) {
      id
      signedUrl
    }
  }
`

const NewOutputTemplate = () => {
  const [createOutputTemplate, { loading, error }] = useMutation(
    CREATE_OUTPUT_TEMPLATE_MUTATION,
    {
      onCompleted: () => {
        toast.success('OutputTemplate created')
        navigate(routes.outputTemplates())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateOutputTemplateInput) => {
    console.log(input)
    createOutputTemplate({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New OutputTemplate</h2>
      </header>
      <div className="rw-segment-main">
        <OutputTemplateForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewOutputTemplate
