import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import LearningPathPage from './page'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock the supabase-data module
jest.mock('../../../components/student/supabase-data', () => ({
  getLearningPath: jest.fn().mockResolvedValue([
    {
      id: 'path-1',
      title: 'Desenvolvimento Web',
      description: 'Trilha completa para se tornar um desenvolvedor web',
      progress: 45,
      modules: [
        { id: 'module-1', title: 'Fundamentos de HTML', completed: true, duration: '2 semanas', lessons: 3, description: 'Estrutura básica e tags HTML' },
        { id: 'module-2', title: 'CSS Básico', completed: false, duration: '3 semanas', lessons: 4, description: 'Estilização e layouts' }
      ]
    }
  ])
}))

describe('LearningPathPage', () => {
  it('should render without crashing', () => {
    // This test just verifies that the component renders without throwing an error
    expect(() => render(<LearningPathPage />)).not.toThrow()
  })
})
