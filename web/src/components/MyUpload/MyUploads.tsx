import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'

import { Link, routes } from '@redwoodjs/router'

import { truncate } from 'src/lib/formatters'

const MyUploadsList = () => {
  const uploads = [
    {
      filename: 'Test EC1-4 v20231007 - CLEAN.xlsm',
      created_at: '2023-12-03T21:47:25.751Z',
      reporting_period_id: 6,
      user_id: 3,
      agency_id: 0,
      validated_at: '2023-12-03T21:47:29.460Z',
      validated_by: 3,
      ec_code: '1.4',
      tenant_id: 1,
      id: 'b4d22796-75a6-4ac3-95f4-0d07f1e12f3e',
      notes:
        'This is to test two things. First, EC1.4 wording. Second, The Audit Report pulling the correct data.',
      invalidated_at: null,
      invalidated_by: null,
      created_by: 'joecomeau01@gmail.com',
      agency_code: 'USDR',
    },
    {
      filename: 'NEW 10002 - DHS - EC2_32 - v202306016 - CLEAN (1).xlsm',
      created_at: '2023-12-01T19:19:21.458Z',
      reporting_period_id: 6,
      user_id: 983,
      agency_id: 0,
      validated_at: '2023-12-01T19:19:25.255Z',
      validated_by: 983,
      ec_code: '2.32',
      tenant_id: 1,
      id: '322f925a-5f4f-4313-a730-a0067217100d',
      notes: null,
      invalidated_at: null,
      invalidated_by: null,
      created_by: 'asridhar+staff@usdigitalresponse.org',
      agency_code: 'USDR',
    },
  ]

  return (
    <Table striped borderless>
      <thead>
        <tr>
          <th className="border">ID</th>
          <th className="border">Agency</th>
          <th className="border">EC Code</th>
          <th className="border">Uploaded By</th>
          <th className="border">Filename</th>
          <th className="border">Notes</th>
          <th className="border">Validated?</th>
        </tr>
      </thead>
      <tbody>
        {uploads.map((upload) => (
          <tr key={upload.id}>
            <td className="border border-slate-700">{truncate(upload.id)}</td>
            <td className="border border-slate-700">
              {truncate(upload.agency_code)}
            </td>
            <td className="border border-slate-700">{upload.ec_code}</td>
            <td className="border border-slate-700">{upload.created_by}</td>
            <td className="border border-slate-700">
              {upload.filename}{' '}
              {/* TODO: Implement file download when the API is ready */}
              {/* <Button size="sm" variant="primary">
                Download file
              </Button> */}
            </td>
            <td className="border border-slate-700">{upload.notes}</td>
            <td className="border border-slate-700">{upload.invalidated_at}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default MyUploadsList
