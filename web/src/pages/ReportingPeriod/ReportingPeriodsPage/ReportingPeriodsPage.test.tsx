import { render } from '@redwoodjs/testing/web'

import ReportingPeriodsPage from './ReportingPeriodsPage'

describe('ReportingPeriodsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReportingPeriodsPage />)
    }).not.toThrow()
  })
})
