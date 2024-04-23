import { screen } from '@testing-library/react'

import { render } from '@redwoodjs/testing/web'

import LoginPage from './LoginPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LoginPage', () => {
  it('renders successfully for local auth', () => {
    process.env.AUTH_PROVIDER = 'local'
    expect(() => {
      render(<LoginPage />)
    }).not.toThrow()
  })
  it('renders a login button for local auth', () => {
    process.env.AUTH_PROVIDER = 'local'
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
  it('renders an empty page when valid auth provider is missing', () => {
    process.env.AUTH_PROVIDER = 'no-auth'
    render(<LoginPage />)
    const submitButton = screen.queryByText('submit')
    expect(submitButton).not.toBeInTheDocument()
  })
})
