import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock Next.js navigation
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  pathname: '/current-path',
  query: {},
}

// Export the mock router for tests to access
export { mockRouter }

// Mock Next.js navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/current-path',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock auth context values
export const mockAuthValues = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: jest.fn().mockResolvedValue({ success: true }),
  register: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  resetPassword: jest.fn().mockResolvedValue({ success: true }),
}

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  mockRouter.push.mockClear()
  mockRouter.replace.mockClear()
  mockAuthValues.login.mockClear()
  mockAuthValues.register.mockClear()
  mockAuthValues.logout.mockClear()
  mockAuthValues.resetPassword.mockClear()
})

// Custom render function without providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options })

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { customRender as render }
