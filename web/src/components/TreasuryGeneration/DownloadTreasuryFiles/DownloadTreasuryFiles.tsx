import Button from 'react-bootstrap/Button'
import { useAuth } from 'web/src/auth'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DOWNLOAD_TREASURY_FILE = gql`
  mutation DownloadTreasuryFile($input: DownloadTreasuryFileInput!) {
    downloadTreasuryFile(input: $input) {
      fileLink
    }
  }
`

const UPLOAD_SUBRECIPIENTS = gql`
  mutation UploadSubrecipients($input: UploadSubrecipientsInput!) {
    uploadSubrecipients(input: $input) {
      success
      message
      countSubrecipients
    }
  }
`

const DownloadTreasuryFiles = () => {
  const { currentUser } = useAuth()
  const [downloadTreasuryFile] = useMutation(DOWNLOAD_TREASURY_FILE, {
    onCompleted: ({ downloadTreasuryFile }) => {
      const { fileLink } = downloadTreasuryFile
      window.open(fileLink, '_blank').focus()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onClick = (event) => {
    downloadTreasuryFile({
      variables: { input: { fileType: event.target.getAttribute('name') } },
    })
  }

  const [uploadSubrecipients] = useMutation(UPLOAD_SUBRECIPIENTS, {
    onCompleted: ({ uploadSubrecipients }) => {
      const { success, message, countSubrecipients } = uploadSubrecipients
      if (success) {
        toast.success(
          `${message} - ${countSubrecipients} subrecipients uploaded`
        )
      } else {
        toast.error(message)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const onSubrecipientClick = () => {
    uploadSubrecipients({
      variables: {
        input: {
          organizationId: currentUser.agency.organizationId,
        },
      },
    })
  }

  return (
    <div className="rw-segment">
      <div className="rw-button-group">
        <Button name="1A" onClick={onClick} className="rw-button">
          Download Project 1A file
        </Button>
        <Button name="1B" onClick={onClick} className="rw-button">
          Download Project 1B file
        </Button>
        <Button name="1C" onClick={onClick} className="rw-button">
          Download Project 1C file
        </Button>
        <Button name="Subrecipient" onClick={onClick} className="rw-button">
          Download Subrecipient file
        </Button>
        <Button
          name="Subrecipient"
          onClick={onSubrecipientClick}
          className="rw-button"
        >
          Upload new Subrecipient file
        </Button>
      </div>
    </div>
  )
}

export default DownloadTreasuryFiles
