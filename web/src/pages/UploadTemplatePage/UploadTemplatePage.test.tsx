import { render } from '@redwoodjs/testing/web'

import UploadTemplatePage from './UploadTemplatePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('UploadTemplatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UploadTemplatePage id="1" />)
    }).not.toThrow()
  })
})
