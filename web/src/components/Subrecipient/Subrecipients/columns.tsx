import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { ParsedSubrecipient, Subrecipient } from 'types/graphql'

import SubrecipientTableUploadLinksDisplay from 'src/components/Subrecipient/SubrecipientTableUploadLinksDisplay/SubrecipientTableUploadLinksDisplay'
import { formatDateString, formatPhoneNumber } from 'src/utils'

const columnHelper = createColumnHelper<Subrecipient>()

function formatDetails(
  parsedSubrecipient: ParsedSubrecipient | null | undefined
) {
  if (!parsedSubrecipient) return 'No details available'

  const fields = [
    { label: 'Name', value: parsedSubrecipient.name },
    { label: 'Recipient ID', value: parsedSubrecipient.recipientId },
    { label: 'POC Name', value: parsedSubrecipient.pocName },
    {
      label: 'POC Phone Number',
      value:
        formatPhoneNumber(parsedSubrecipient.pocPhoneNumber) ||
        parsedSubrecipient.pocPhoneNumber,
    },
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
  columnHelper.accessor('validSubrecipientUploads', {
    id: 'details',
    header: 'Details',
    cell: (info) => {
      const uploads = info.getValue()
      if (uploads && uploads.length > 0 && uploads[0].parsedSubrecipient) {
        return formatDetails(uploads[0].parsedSubrecipient)
      }
      return 'No details available'
    },
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => formatDateString(info.getValue()),
    header: 'Created Date',
  }),
  columnHelper.accessor('validSubrecipientUploads', {
    id: 'lastUpdatedDate',
    header: 'Last Updated Date',
    cell: (info) => {
      const uploads = info.getValue()
      if (uploads && uploads.length > 0 && uploads[0].updatedAt) {
        return formatDateString(uploads[0].updatedAt)
      }
      return 'N/A'
    },
  }),
  {
    id: 'links',
    header: 'Upload Links',
    cell: ({ row }) => (
      <SubrecipientTableUploadLinksDisplay
        validSubrecipientUploads={row.original.validSubrecipientUploads}
        invalidSubrecipientUploads={row.original.invalidSubrecipientUploads}
      />
    ),
    enableSorting: false,
  },
]
