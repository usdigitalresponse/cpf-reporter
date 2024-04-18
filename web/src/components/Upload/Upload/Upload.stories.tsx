import type { Meta, StoryObj } from '@storybook/react'

import Upload from './Upload'

const meta: Meta<typeof Upload> = {
  component: Upload,
}

export default meta

type Story = StoryObj<typeof Upload>

export const ValidUpload: Story = {
  args: {
    upload: {
      id: 3,
      filename: 'File with empty JSON results',
      agency: {
        code: 'MAUSDR',
      },
      expenditureCategory: {
        code: '1B',
      },
      reportingPeriod: {
        name: 'repperiod1',
      },
      uploadedBy: {
        name: 'Organization Staff',
      },
      latestValidation: {
        passed: true,
        results: [],
        createdAt: '2024-04-08T02:45:26.800Z',
        initiatedBy: {
          name: 'Organization Staff',
        },
      },
      createdAt: '2024-04-08T02:44:26.238Z',
      updatedAt: '2024-04-08T02:44:26.238Z',
    },
  },
}

export const InvalidUpload: Story = {
  args: {
    upload: {
      id: 3,
      filename: 'File with empty JSON results',
      agency: {
        code: 'MAUSDR',
      },
      expenditureCategory: {
        code: '1B',
      },
      reportingPeriod: {
        name: 'repperiod1',
      },
      uploadedBy: {
        name: 'Organization Staff',
      },
      latestValidation: {
        passed: true,
        results: [
          {
            col: 'B',
            row: '1',
            tab: 'Logic',
            message:
              'Upload template version is older than the latest input template',
            severity: 'warn',
          },
          {
            col: 'D',
            row: '2',
            tab: 'Cover',
            message: 'EC code must be set',
            severity: 'err',
          },
        ],
        createdAt: '2024-04-08T02:45:26.800Z',
        initiatedBy: {
          name: 'Organization Staff',
        },
      },
      createdAt: '2024-04-08T02:44:26.238Z',
      updatedAt: '2024-04-08T02:44:26.238Z',
    },
  },
}

export const UploadValidationInProgress: Story = {
  args: {
    upload: {
      id: 3,
      filename: 'File with empty JSON results',
      agency: {
        code: 'MAUSDR',
      },
      expenditureCategory: {
        code: '1B',
      },
      reportingPeriod: {
        name: 'repperiod1',
      },
      uploadedBy: {
        name: 'Organization Staff',
      },
      latestValidation: {
        passed: true,
        results: null,
        createdAt: '2024-04-08T02:45:26.800Z',
        initiatedBy: {
          name: 'Organization Staff',
        },
      },
      createdAt: '2024-04-08T02:44:26.238Z',
      updatedAt: '2024-04-08T02:44:26.238Z',
    },
  },
}
