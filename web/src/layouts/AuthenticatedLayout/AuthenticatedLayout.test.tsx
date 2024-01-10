import { render } from '@redwoodjs/testing/web'

import AuthenticatedLayout from './AuthenticatedLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AuthenticatedLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AuthenticatedLayout />)
    }).not.toThrow()
  })
})
