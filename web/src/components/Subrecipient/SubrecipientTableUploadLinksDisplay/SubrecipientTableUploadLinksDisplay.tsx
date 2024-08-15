import { Subrecipient } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

const DOWNLOAD_UPLOAD_FILE = gql`
  mutation downloadUploadFile($id: Int!) {
    downloadUploadFile(id: $id)
  }
`

interface SubrecipientTableUploadLinksDisplayProps {
  validSubrecipientUploads: Subrecipient['validSubrecipientUploads']
  invalidSubrecipientUploads: Subrecipient['invalidSubrecipientUploads']
}

const SubrecipientTableUploadLinksDisplay = ({
  validSubrecipientUploads,
  invalidSubrecipientUploads,
}: SubrecipientTableUploadLinksDisplayProps) => {
  const [downloadUploadFile] = useMutation(DOWNLOAD_UPLOAD_FILE, {
    onCompleted: ({ downloadUploadFile }) => {
      window.open(downloadUploadFile, '_blank').focus()
    },
    onError: (error) => {
      console.error('Error downloading upload file', error)
    },
  })

  const handleFileDownload = (id: number) => {
    downloadUploadFile({ variables: { id } })
  }

  return (
    <>
      {validSubrecipientUploads.length > 0 &&
        validSubrecipientUploads[0].upload && (
          <>
            <div className="fw-bold">Latest Valid Upload:</div>
            <div className="mb-3">
              <button
                onClick={() =>
                  handleFileDownload(validSubrecipientUploads[0].upload.id)
                }
                title={`Download upload ${validSubrecipientUploads[0].upload.id}`}
                className="btn btn-link p-0"
              >
                {validSubrecipientUploads[0].upload.filename}.xlsm
              </button>
            </div>
          </>
        )}

      {validSubrecipientUploads.length > 1 && (
        <>
          <div className="fw-bold">Other Valid Uploads:</div>
          <div className="mb-3">
            {validSubrecipientUploads.slice(1).map((upload) => (
              <button
                key={upload.id}
                onClick={() => handleFileDownload(upload.upload.id)}
                className="btn btn-link p-0"
              >
                {upload.upload.filename}.xlsm
              </button>
            ))}
          </div>
        </>
      )}

      {invalidSubrecipientUploads.length > 0 && (
        <>
          <div className="fw-bold">Invalid Uploads:</div>
          <div>
            {invalidSubrecipientUploads.map((upload) => (
              <button
                key={upload.id}
                onClick={() => handleFileDownload(upload.upload.id)}
                className="btn btn-link p-0"
              >
                {upload.upload.filename}.xlsm
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default SubrecipientTableUploadLinksDisplay
