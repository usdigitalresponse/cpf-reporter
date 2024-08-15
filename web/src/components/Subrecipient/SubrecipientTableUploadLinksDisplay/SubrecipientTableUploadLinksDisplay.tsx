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
  return (
    <>
      {validSubrecipientUploads.length > 0 &&
        validSubrecipientUploads[0].upload && (
          <>
            <div className="fw-bold">Latest Valid Upload:</div>
            <div className="mb-3">
              <Link
                to={routes.upload({
                  id: validSubrecipientUploads[0].upload.id,
                })}
                title={`Show upload ${validSubrecipientUploads[0].upload.id} detail`}
                className="link-underline link-underline-opacity-0"
              >
                {validSubrecipientUploads[0].upload.filename}.xlsm
              </Link>
            </div>
          </>
        )}

      {validSubrecipientUploads.length > 1 && (
        <>
          <div className="fw-bold">Other Valid Uploads:</div>
          <div className="mb-3">
            {validSubrecipientUploads.slice(1).map((upload) => (
              <Link
                key={upload.id}
                to={routes.upload({ id: upload.upload.id })}
              >
                {upload.upload.filename}.xlsm
              </Link>
            ))}
          </div>
        </>
      )}

      {invalidSubrecipientUploads.length > 0 && (
        <>
          <div className="fw-bold">Invalid Uploads:</div>
          <div>
            {invalidSubrecipientUploads.map((upload) => (
              <Link
                key={upload.id}
                to={routes.upload({ id: upload.upload.id })}
              >
                {upload.upload.filename}.xlsm
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default SubrecipientTableUploadLinksDisplay
