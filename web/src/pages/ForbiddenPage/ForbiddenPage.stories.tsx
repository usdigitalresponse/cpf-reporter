import type { Meta, StoryObj } from '@storybook/react'

import ForbiddenPage from './ForbiddenPage'

const meta: Meta<typeof ForbiddenPage> = {
  component: ForbiddenPage,
}

export default meta

type Story = StoryObj<typeof ForbiddenPage>

export const Primary: Story = {}
