import { createColumnHelper, ColumnDef } from '@tanstack/react-table'

import { Link, routes } from '@redwoodjs/router'

import { formatDateString } from 'src/utils'

interface SubrecipientData {
  ueiTinCombo: string
  createdAt: string
  latestSubrecipientUpload: {
    updatedAt: string
    upload: {
      id: string
    }
    id: string
  }
}

const columnHelper = createColumnHelper<SubrecipientData>()
function uploadLinksDisplay(row) {
  return (
    <div>
      <div className="fw-bold">Latest Upload:</div>
      <div>
        <Link
          to={routes.upload({ id: row.latestSubrecipientUpload.upload.id })}
          title={`Show upload ${row.latestSubrecipientUpload.upload.id} detail`}
          className="link-underline link-underline-opacity-0"
        >
          {row.latestSubrecipientUpload.id}
        </Link>
      </div>

      <div className="fw-bold">Other Uploads:</div>
      <div>Other uploads here</div>
    </div>
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
  //   columnHelper.accessor('latestSubrecipientUpload.rawSubrecipient', {
  //     cell: (info) => info.getValue(),
  //     header: 'Details',
  //   }),
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
