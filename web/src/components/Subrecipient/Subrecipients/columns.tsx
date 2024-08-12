import { createColumnHelper, ColumnDef } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

interface SubrecipientData {
  ueiTinCombo: string
  createdAt: string
  latestSubrecipientUpload: any
  subrecipientUploads: Array<{
    id: string
    upload: {
      id: string
    }
    createdAt: string
  }>
}
interface ParsedSubrecipient {
  name: string
  recipientId: string
  pocName: string
  pocPhoneNumber: string
  pocEmailAddress: string
  zip5: string
  zip4: string
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  state: string
}

const columnHelper = createColumnHelper<SubrecipientData>()

function uploadLinksDisplay(row: SubrecipientData) {
  const latestUpload = row.latestSubrecipientUpload
  const otherUploads = row.subrecipientUploads.filter(
    (upload) => upload.id !== latestUpload.id
  )

  return (
    <>
      <div className="fw-bold mt-8">Latest Upload:</div>
      <div className="mb-8">
        <Link
          to={routes.upload({ id: latestUpload.upload.id })}
          title={`Show upload ${latestUpload.upload.id} detail`}
          className="link-underline link-underline-opacity-0"
        >
          {latestUpload.id}
        </Link>
      </div>
      <br />
      <div className="fw-bold">Other Uploads:</div>
      <div>
        {otherUploads.map((upload) => (
          <Link
            key={upload.id}
            to={routes.upload({ id: upload.upload.id })}
            title={`Show upload ${upload.upload.id} detail`}
            className="link-underline link-underline-opacity-0 me-2"
          >
            {upload.id}
          </Link>
        ))}
      </div>
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

export const columnDefs: ColumnDef<SubrecipientData>[] = [
  columnHelper.accessor('ueiTinCombo', {
    id: 'uei',
    cell: (info) => {
      const value = info.getValue()
      return typeof value === 'string' ? value.split('_')[0] : ''
    },
    header: 'UEI',
  }),
  columnHelper.accessor('ueiTinCombo', {
    id: 'tin',
    cell: (info) => {
      const value = info.getValue()
      return typeof value === 'string' ? value.split('_')[1] : ''
    },
    header: 'TIN',
  }),
  columnHelper.accessor('latestSubrecipientUpload.parsedSubrecipient', {
    id: 'details',
    header: 'Details',
    cell: (info) => formatDetails(info.getValue()),
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => formatDateString(info.getValue()),
    header: 'Created Date',
  }),
  columnHelper.accessor('latestSubrecipientUpload.updatedAt', {
    cell: (info) => formatDateString(info.getValue()),
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
