import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LearningPathPage from './page'
import { getLearningPaths } from '../../../components/student/mock-data'

// Mock the mock-data module
jest.mock('../../../components/student/mock-data')

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

describe('LearningPathPage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock the getLearningPaths function to return test data
    const mockLearningPaths = [
      {
        id: 'path1',
        title: 'Test Path 1',
        description: 'Test Description 1',
        modules: [
          {
            id: 'module1',
            title: 'Test Module 1',
            description: 'Test Module Description 1',
            duration: '2 weeks',
            status: 'completed',
            lessons: [
              {
                id: 'lesson1',
                title: 'Test Lesson 1',
                description: 'Test Lesson Description 1',
                duration: '30 min',
                type: 'video',
                status: 'completed',
              },
            ],
          },
        ],
      },
      {
        id: 'path2',
        title: 'Test Path 2',
        description: 'Test Description 2',
        modules: [],
      },
    ]
    
    ;(getLearningPaths as jest.Mock).mockResolvedValue(mockLearningPaths)
  })

  it('renders the learning path page', async () => {
    // Render component
    render(<LearningPathPage />)
    
    // Initially should show loading state
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
    })
  })
})
