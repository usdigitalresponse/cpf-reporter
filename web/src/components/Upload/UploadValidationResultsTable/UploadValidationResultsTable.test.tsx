import { render } from '@redwoodjs/testing/web'

import UploadValidationResultsTable from './UploadValidationResultsTable'
import { Severity } from './UploadValidationResultsTable'

describe('UploadValidationResultsTable', () => {
  it('renders successfully when empty', () => {
    expect(() => {
      render(<UploadValidationResultsTable errors={[]} />)
    }).not.toThrow()
  })
  it('renders successfully when given minimal results', () => {
    expect(() => {
      render(
        <UploadValidationResultsTable
          errors={[
            {
              message:
                'Upload template version is older than the latest input template',
              tab: 'Logic',
              row: '1',
              col: 'B',
              severity: Severity.Warning,
            },
          ]}
        />
      )
    }).not.toThrow()
  })
})
