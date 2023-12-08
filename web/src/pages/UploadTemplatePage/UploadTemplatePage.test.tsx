import { render } from '@redwoodjs/testing/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import UploadTemplatePage from './UploadTemplatePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts
function apolloProvider(children) {
  return <RedwoodApolloProvider>{children}</RedwoodApolloProvider>
}

describe('UploadTemplatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(apolloProvider(<UploadTemplatePage id={1} />))
    }).not.toThrow()
  })
})
