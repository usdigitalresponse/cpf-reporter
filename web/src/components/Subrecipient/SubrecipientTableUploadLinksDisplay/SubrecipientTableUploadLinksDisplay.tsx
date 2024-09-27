import { Subrecipient } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

interface SubrecipientTableUploadLinksDisplayProps {
  validSubrecipientUploads: Subrecipient['validSubrecipientUploads']
  invalidSubrecipientUploads: Subrecipient['invalidSubrecipientUploads']
}

const SubrecipientTableUploadLinksDisplay = ({
  validSubrecipientUploads,
  invalidSubrecipientUploads,
}: SubrecipientTableUploadLinksDisplayProps) => {
  const renderUploadLink = (upload) => (
    <Link
      key={upload.id}
      to={routes.upload({ id: upload.upload.id })}
      title={`Show upload ${upload.upload.id} detail`}
      className="link-underline link-underline-opacity-0"
    >
      Upload {upload.id}
    </Link>
  )

  return (
    <>
      {validSubrecipientUploads.length > 0 &&
        validSubrecipientUploads[0].upload && (
          <>
            <div className="fw-bold">Latest Valid Upload:</div>
            <div className="mb-3">
              {renderUploadLink(validSubrecipientUploads[0]).upload}
            </div>
          </>
        )}

      {validSubrecipientUploads.length > 1 && (
        <>
          <div className="fw-bold">Other Valid Uploads:</div>
          <div className="mb-3">
            {validSubrecipientUploads
              .slice(1)
              .map((upload) => renderUploadLink(upload))}
          </div>
        </>
      )}

      {invalidSubrecipientUploads.length > 0 && (
        <>
          <div className="fw-bold">Invalid Uploads:</div>
          <div>
            {invalidSubrecipientUploads.map((upload) =>
              renderUploadLink(upload)
            )}
          </div>
        </>
      )}
    </>
  )
}

export default SubrecipientTableUploadLinksDisplay
