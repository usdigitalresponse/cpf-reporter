import { render } from '@redwoodjs/testing/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import ReportingPeriodsPage from './ReportingPeriodsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts
function apolloProvider(children) {
  return <RedwoodApolloProvider>{children}</RedwoodApolloProvider>
}

describe('ReportingPeriodsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(apolloProvider(<ReportingPeriodsPage />))
    }).not.toThrow()
  })
})
