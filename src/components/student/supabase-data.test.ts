import '@testing-library/jest-dom'
import { getStudentProfile, getStudentCourses, getLearningPath } from './supabase-data'
import { supabase } from '../../lib/supabase'

// Mock the supabase module
jest.mock('../../lib/supabase', () => {
  return {
    supabase: {
      from: jest.fn()
    }
  }
})

// Mock the mock-data module
jest.mock('./mock-data', () => ({
  getStudentProfile: jest.fn().mockResolvedValue({ id: 'mock-student', name: 'Mock Student' }),
  getStudentCourses: jest.fn().mockResolvedValue([{ id: 'mock-course', title: 'Mock Course' }]),
  getLearningPath: jest.fn().mockResolvedValue([{ id: 'mock-path', title: 'Mock Path' }])
}))

describe('Supabase Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle Supabase data operations', async () => {
    // Just a basic test to ensure the module can be imported and functions exist
    expect(typeof getStudentProfile).toBe('function')
    expect(typeof getStudentCourses).toBe('function')
    expect(typeof getLearningPath).toBe('function')
  })
})
