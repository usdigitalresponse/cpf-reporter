import type { Meta, StoryObj } from '@storybook/react'

import UploadValidationResultsTable from './UploadValidationResultsTable'
import { Severity } from './UploadValidationResultsTable'

const meta: Meta<typeof UploadValidationResultsTable> = {
  component: UploadValidationResultsTable,
}

export default meta

type Story = StoryObj<typeof UploadValidationResultsTable>

const messages = [
  {
    message: 'Upload template version is older than the latest input template',
    tab: 'Logic',
    row: '1',
    col: 'B',
    severity: Severity.Warning,
  },
  {
    message: 'EC code must be set',
    tab: 'Cover',
    row: '2',
    col: 'D',
    severity: Severity.Error,
  },
  {
    message: 'This is a warning',
    severity: Severity.Error,
  },
]

export const Primary: Story = {
  args: {
    errors: messages,
  },
}

export const NoErrors: Story = {
  args: {
    errors: [],
  },
}
