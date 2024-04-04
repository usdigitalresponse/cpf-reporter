import type { Meta, StoryObj } from '@storybook/react'

import UploadValidationButtonGroup from './UploadValidationButtonGroup'

const meta: Meta<typeof UploadValidationButtonGroup> = {
  component: UploadValidationButtonGroup,
}

export default meta

type Story = StoryObj<typeof UploadValidationButtonGroup>

export const ValidUpload: Story = {
  args: {
    latestValidation: {
      passed: true,
      results: [],
    },
    handleFileDownload: () => {},
    handleForceInvalidate: () => {},
    handleValidate: () => {},
  },
}

export const InvalidUpload: Story = {
  args: {
    latestValidation: {
      passed: false,
      results: [
        {
          tab: 'Cover',
          severity: 'err',
          message: 'EC code must be set',
          row: '2',
          col: 'D',
        },
      ],
    },
    handleFileDownload: () => {},
    handleForceInvalidate: () => {},
    handleValidate: () => {},
  },
}

export const UploadValidationInProgress: Story = {
  args: {
    latestValidation: {
      passed: false,
      results: null,
    },
    handleFileDownload: () => {},
    handleForceInvalidate: () => {},
    handleValidate: () => {},
  },
}
