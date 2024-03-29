import { render } from '@redwoodjs/testing/web'

import UploadValidationResultsTable from './UploadValidationResultsTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('UploadValidationResultsTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UploadValidationResultsTable />)
    }).not.toThrow()
  })
})
