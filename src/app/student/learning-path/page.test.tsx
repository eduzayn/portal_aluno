import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LearningPathPage from './page'
import { getLearningPaths } from '../../../components/student/mock-data'

// Mock the mock-data module
jest.mock('../../../components/student/mock-data', () => ({
  getLearningPaths: jest.fn(),
}))

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
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

  it('renders loading state initially', () => {
    render(<LearningPathPage />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('renders learning paths after loading', async () => {
    render(<LearningPathPage />)
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
    })
    
    expect(screen.getAllByText('Test Path 1')).toHaveLength(2)
    expect(screen.getByText('Test Path 2')).toBeInTheDocument()
    expect(screen.getByText('Test Description 1')).toBeInTheDocument()
  })

  it('changes active path when tab is clicked', async () => {
    render(<LearningPathPage />)
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument()
    })
    
    // Initially, the first path should be active
    expect(screen.getByText('Test Module 1')).toBeInTheDocument()
    
    // Click on the second path tab
    await userEvent.click(screen.getByText('Test Path 2'))
    
    // The second path should now be active
    expect(screen.queryByText('Test Module 1')).not.toBeInTheDocument()
    expect(screen.getByText('Test Description 2')).toBeInTheDocument()
  })
})
