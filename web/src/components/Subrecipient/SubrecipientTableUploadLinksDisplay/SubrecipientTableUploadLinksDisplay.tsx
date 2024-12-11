import { FindSubrecipients } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

type SubrecipientUpload =
  | FindSubrecipients['subrecipients'][number]['validSubrecipientUploads'][number]
  | FindSubrecipients['subrecipients'][number]['invalidSubrecipientUploads'][number]

interface SubrecipientTableUploadLinksDisplayProps {
  validSubrecipientUploads: FindSubrecipients['subrecipients'][number]['validSubrecipientUploads']
  invalidSubrecipientUploads: FindSubrecipients['subrecipients'][number]['invalidSubrecipientUploads']
}

const SubrecipientTableUploadLinksDisplay = ({
  validSubrecipientUploads,
  invalidSubrecipientUploads,
}: SubrecipientTableUploadLinksDisplayProps) => {
  const renderUploadLink = (subrecipientUpload: SubrecipientUpload) => {
    const { id, upload } = subrecipientUpload
    return (
      <Link
        key={id}
        to={routes.upload({ id: upload.id })}
        title={`Show upload ${upload.id} detail`}
        className="d-block link-underline link-underline-opacity-0"
      >
        Upload {upload.id}
      </Link>
    )
  }

  const renderUploadSection = (
    title: string,
    uploads: SubrecipientUpload[]
  ) => (
    <>
      <div className="fw-bold">{title}</div>
      <div className="mb-3">{uploads.map(renderUploadLink)}</div>
    </>
  )

  return (
    <>
      {validSubrecipientUploads.length > 0 &&
        renderUploadSection('Latest Valid Upload:', [
          validSubrecipientUploads[0],
        ])}
      {validSubrecipientUploads.length > 1 &&
        renderUploadSection(
          'Other Valid Uploads:',
          validSubrecipientUploads.slice(1)
        )}
      {invalidSubrecipientUploads.length > 0 &&
        renderUploadSection('Invalid Uploads:', invalidSubrecipientUploads)}
    </>
  )
}

export default SubrecipientTableUploadLinksDisplay
