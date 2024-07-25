import Button from 'react-bootstrap/Button'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const DOWNLOAD_TREASURY_FILE = gql`
  mutation DownloadTreasuryFile($input: DownloadTreasuryFileInput!) {
    downloadTreasuryFile(input: $input) {
      fileLink
    }
  }
`

const DownloadTreasuryFiles = () => {
  const [downloadTreasuryFile] = useMutation(DOWNLOAD_TREASURY_FILE, {
    onCompleted: ({ downloadTreasuryFile }) => {
      const { fileLink } = downloadTreasuryFile
      console.log(fileLink)
      console.log('Opening treasury file link in new tab..')
      window.open(fileLink, '_blank').focus()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const onClick = (event) => {
    console.log(event.target.getAttribute('name'))
    downloadTreasuryFile({
      variables: { input: { fileType: event.target.getAttribute('name') } },
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
      </div>
    </div>
  )
}

export default DownloadTreasuryFiles
