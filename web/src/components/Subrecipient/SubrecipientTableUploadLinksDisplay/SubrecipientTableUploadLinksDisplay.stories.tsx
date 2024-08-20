import type { Meta, StoryObj } from '@storybook/react'

import SubrecipientTableUploadLinksDisplay from './SubrecipientTableUploadLinksDisplay'

const meta: Meta<typeof SubrecipientTableUploadLinksDisplay> = {
  component: SubrecipientTableUploadLinksDisplay,
}

export default meta

type Story = StoryObj<typeof SubrecipientTableUploadLinksDisplay>

export const OneValidUpload: Story = {
  args: {
    validSubrecipientUploads: [
      {
        id: 1,
        upload: {
          id: 2,
          filename: 'One valid upload',
        },
        updatedAt: '2024-08-14T22:04:53.850Z',
        createdAt: '2024-08-14T22:04:53.850Z',
      },
    ],
    invalidSubrecipientUploads: [],
  },
}

export const MultipleValidUploads: Story = {
  args: {
    validSubrecipientUploads: [
      {
        id: 2,
        upload: {
          id: 3,
          filename: 'Most recent valid upload',
        },
        updatedAt: '2024-08-14T22:04:53.850Z',
        createdAt: '2024-08-14T22:04:53.850Z',
      },
      {
        id: 3,
        upload: {
          id: 4,
          filename: 'Older valid upload',
        },
        updatedAt: '2024-08-14T22:04:53.850Z',
        createdAt: '2024-08-14T22:04:53.850Z',
      },
    ],
    invalidSubrecipientUploads: [],
  },
}

export const MultipleInvalidUploads: Story = {
  args: {
    validSubrecipientUploads: [],
    invalidSubrecipientUploads: [
      {
        id: 4,
        upload: {
          id: 5,
          filename: 'Invalid upload 1',
        },
        createdAt: '2024-08-10T22:04:53.850Z',
        updatedAt: '2024-08-11T17:36:43.828Z',
      },
      {
        id: 5,
        upload: {
          id: 6,
          filename: 'Invalid upload 2',
        },
        createdAt: '2024-08-12T22:04:53.850Z',
        updatedAt: '2024-08-14T17:36:43.828Z',
      },
    ],
  },
}

export const ValidAndInvalidUploads: Story = {
  args: {
    validSubrecipientUploads: [
      {
        id: 6,
        upload: {
          id: 7,
          filename: 'Valid upload 1',
        },
        createdAt: '2024-08-14T22:04:53.850Z',
      },
      {
        id: 7,
        upload: {
          id: 8,
          filename: 'Valid upload 2',
        },
        updatedAt: '2024-08-14T22:04:53.850Z',
        createdAt: '2024-08-14T22:04:53.850Z',
      },
    ],
    invalidSubrecipientUploads: [
      {
        id: 8,
        upload: {
          id: 9,
          filename: 'Invalid upload 1',
        },
        createdAt: '2024-08-14T22:04:53.850Z',
        updatedAt: '2024-08-14T22:04:53.850Z',
      },
      {
        id: 9,
        upload: {
          id: 10,
          filename: 'Invalid upload 2',
        },
        createdAt: '2024-08-14T22:04:53.850Z',
        updatedAt: '2024-08-14T22:04:53.850Z',
      },
    ],
  },
}
