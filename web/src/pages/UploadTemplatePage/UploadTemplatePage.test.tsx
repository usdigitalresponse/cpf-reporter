import { render } from '@redwoodjs/testing/web'

import UploadTemplatePage from './UploadTemplatePage'

describe('UploadTemplatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UploadTemplatePage id={1} />)
    }).not.toThrow()
  })
})
