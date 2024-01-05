import type { Meta, StoryObj } from '@storybook/react'

import AuthenticatedLayout from './AuthenticatedLayout'

const meta: Meta<typeof AuthenticatedLayout> = {
  component: AuthenticatedLayout,
}

export default meta

type Story = StoryObj<typeof AuthenticatedLayout>

export const Primary: Story = {}
