import { render } from '@redwoodjs/testing/web'

import ReportingPeriodsPage from './ReportingPeriodsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ReportingPeriodsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReportingPeriodsPage />)
    }).not.toThrow()
  })
})
