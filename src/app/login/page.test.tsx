import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/current-path',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({ success: true }),
    isAuthenticated: false,
    isLoading: false,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('renders login form', () => {
    render(<LoginPage />)
    
    // Check for form elements
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})
