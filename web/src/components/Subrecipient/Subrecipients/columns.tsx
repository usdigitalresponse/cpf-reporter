import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { ParsedSubrecipient, Subrecipient } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

const columnHelper = createColumnHelper<Subrecipient>()

function uploadLinksDisplay(row: Subrecipient) {
  if (!row.latestSubrecipientUpload) {
    return <div>No uploads available</div>
  }

  const latestUpload = row.latestSubrecipientUpload
  const otherUploads =
    row.subrecipientUploads?.filter(
      (upload) => upload.id !== latestUpload.id
    ) || []

  return (
    <>
      <div className="fw-bold">Latest Upload:</div>
      <div className="mb-3">
        {latestUpload.upload ? (
          <Link
            to={routes.upload({ id: latestUpload.upload.id })}
            title={`Show upload ${latestUpload.upload.id} detail`}
            className="link-underline link-underline-opacity-0"
          >
            {latestUpload.upload.filename}.xlsm
          </Link>
        ) : (
          'Upload details not available'
        )}
      </div>

      {otherUploads.length > 0 && (
        <>
          <div className="fw-bold">Other Uploads:</div>
          <div>
            {otherUploads.map((upload) =>
              upload.upload ? (
                <Link
                  key={upload.id}
                  to={routes.upload({ id: upload.upload.id })}
                  title={`Show upload ${upload.upload.id} detail`}
                  className="link-underline link-underline-opacity-0"
                >
                  {upload.upload.filename}.xlsm
                </Link>
              ) : (
                <span key={upload.id} className="me-2">
                  Upload {upload.id} (details not available)
                </span>
              )
            )}
          </div>
        </>
      )}
    </>
  )
}

function formatDetails(
  parsedSubrecipient: ParsedSubrecipient | null | undefined
) {
  if (!parsedSubrecipient) return 'No details available'

  const fields = [
    { label: 'Name', value: parsedSubrecipient.name },
    { label: 'Recipient ID', value: parsedSubrecipient.recipientId },
    { label: 'POC Name', value: parsedSubrecipient.pocName },
    { label: 'POC Phone Number', value: parsedSubrecipient.pocPhoneNumber },
    { label: 'POC Email Address', value: parsedSubrecipient.pocEmailAddress },
    { label: 'Zip5', value: parsedSubrecipient.zip5 },
    { label: 'Zip4', value: parsedSubrecipient.zip4 },
    { label: 'Address Line 1', value: parsedSubrecipient.addressLine1 },
    { label: 'Address Line 2', value: parsedSubrecipient.addressLine2 },
    { label: 'Address Line 3', value: parsedSubrecipient.addressLine3 },
    { label: 'City', value: parsedSubrecipient.city },
    { label: 'State', value: parsedSubrecipient.state },
  ]

  return (
    <ul className="list-unstyled">
      {fields.map(({ label, value }) => (
        <li key={label}>
          <strong>{label}:</strong> {value || ''}
        </li>
      ))}
    </ul>
  )
}
const getUEI = (ueiTinCombo: string) => {
  const value = ueiTinCombo.split('_')[0]
  return value ? Number(value) : null
}

const getTIN = (ueiTinCombo: string) => {
  const value = ueiTinCombo.split('_')[1]
  return value ? Number(value) : null
}

export const columnDefs: ColumnDef<Subrecipient>[] = [
  columnHelper.accessor((row) => getUEI(row.ueiTinCombo), {
    id: 'uei',
    cell: (info) => info.getValue() ?? '',
    header: 'UEI',
  }),
  columnHelper.accessor((row) => getTIN(row.ueiTinCombo), {
    id: 'tin',
    cell: (info) => info.getValue() ?? '',
    header: 'TIN',
  }),
  columnHelper.accessor('latestSubrecipientUpload.parsedSubrecipient', {
    id: 'details',
    header: 'Details',
    cell: (info) => formatDetails(info.getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => formatDateString(info.getValue()),
    header: 'Created Date',
  }),
  columnHelper.accessor('latestSubrecipientUpload.updatedAt', {
    cell: (info) =>
      info.getValue() ? formatDateString(info.getValue() as string) : 'N/A',
    header: 'Last Updated Date',
  }),
  {
    accessorFn: uploadLinksDisplay,
    cell: (info) => info.getValue(),
    id: 'links',
    header: 'Upload Links',
    enableSorting: false,
  },
]
