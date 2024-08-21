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
      outputTemplate {
        id
      }
      signedUrls {
        CPF1A
        CPF1B
        CPF1C
        CPFSubrecipient
      }
    }
  }
`

type ExtraFileFields = {
  fileCPF1A: File[]
  fileCPF1B: File[]
  fileCPF1C: File[]
  fileCPFSubrecipient: File[]
}

type FileNames = {
  filenames: {
    CPF1A: string
    CPF1B: string
    CPF1C: string
    CPFSubrecipient: string
  }
}

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

  const putObject = async (signedUrl: string, file: File) => {
    fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'x-amz-server-side-encryption': 'AES256',
      },
      body: file,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
      })
      .then((responseData) => {
        console.log('File upload successful. Response:', responseData)
      })
      .catch((error) => {
        console.error('Error uploading file:', error)
      })
  }
  const verifyFileNames = (
    input: CreateOutputTemplateInput & ExtraFileFields & FileNames
  ) => {
    const { filenames } = input
    return (
      filenames.CPF1A.includes('CPF1ABroadbandInfrastructureTemplate') &&
      filenames.CPF1B.includes('CPF1BDigitalConnectivityTechTemplate') &&
      filenames.CPF1C.includes('CPF1CMultiPurposeCommunityTemplate') &&
      filenames.CPFSubrecipient.includes('CPFSubrecipientTemplate')
    )
  }

  const onSave = async (
    input: CreateOutputTemplateInput & ExtraFileFields & FileNames
  ) => {
    if (!verifyFileNames(input)) {
      toast.error(
        'Invalid file names. Please ensure the files contain the correct template names.'
      )
      return
    }

    const fileCPF1A = input.fileCPF1A[0]
    const fileCPF1B = input.fileCPF1B[0]
    const fileCPF1C = input.fileCPF1C[0]
    const fileCPFSubrecipient = input.fileCPFSubrecipient[0]

    delete input.fileCPF1A
    delete input.fileCPF1B
    delete input.fileCPF1C
    delete input.fileCPFSubrecipient

    const response = await createOutputTemplate({ variables: { input } })

    // Upload files to S3
    const urls = response.data?.createOutputTemplate?.signedUrls
    putObject(urls.CPF1A, fileCPF1A)
    putObject(urls.CPF1B, fileCPF1B)
    putObject(urls.CPF1C, fileCPF1C)
    putObject(urls.CPFSubrecipient, fileCPFSubrecipient)
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
