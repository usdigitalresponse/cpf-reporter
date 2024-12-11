import { render } from '@redwoodjs/testing/web'

import UploadSeriesTable from './UploadSeriesTable'
import { standardUpload, standardSeriesUploads } from './UploadSeriesTable.mock'

describe('UploadSeriesTable', () => {
  it('renders successfully when uploads are empty', () => {
    expect(() => {
      render(<UploadSeriesTable upload={standardUpload()} seriesUploads={[]} />)
    }).not.toThrow()
  })

  it('renders successfully when given multiple results', () => {
    expect(() => {
      render(
        <UploadSeriesTable
          upload={standardUpload()}
          seriesUploads={standardSeriesUploads()}
        />
      )
    }).not.toThrow()
  })
})
