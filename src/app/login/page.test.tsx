import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginPage from './page'
import { supabase } from '../../lib/supabase'

// Mock the supabase module
jest.mock('../../lib/supabase')

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
    
    // Check for form elements with both approaches
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('handles successful login with Supabase', async () => {
    const mockRouter = { push: jest.fn() }
    require('next/navigation').useRouter.mockReturnValue(mockRouter)
    
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    render(<LoginPage />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/student/dashboard')
    })
  })

  it('displays error message on login failure', async () => {
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })

    render(<LoginPage />)
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/senha/i), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})
