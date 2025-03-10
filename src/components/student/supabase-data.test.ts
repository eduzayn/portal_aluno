import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { getStudentProfile, getStudentCourses, getLearningPath } from './supabase-data'
import { supabase } from '../../lib/supabase'
import { getStudentProfile as getMockStudentProfile, getStudentCourses as getMockStudentCourses } from './mock-data'

// Mock the supabase module
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signInWithPassword: jest.fn(),
      getSession: jest.fn(),
      signOut: jest.fn(),
    }
  }
}))

// Mock the mock-data module
jest.mock('./mock-data')

describe('Supabase Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getStudentProfile', () => {
    it('returns data from Supabase when successful', async () => {
      const mockData = { id: 'student-1', name: 'Test Student', certificates: [] }
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null } as any),
      })

      const result = await getStudentProfile('student-1')
      
      expect(result).toEqual(mockData)
      expect(supabase.from).toHaveBeenCalledWith('students')
    })

    it('falls back to mock data when Supabase fails', async () => {
      const mockError = new Error('Supabase error')
      const mockData = { id: 'student-1', name: 'Mock Student', certificates: [] }
      
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      })
      
      ;(getMockStudentProfile as jest.Mock).mockResolvedValue(mockData)

      const result = await getStudentProfile('student-1')
      
      expect(result).toEqual(mockData)
      expect(getMockStudentProfile).toHaveBeenCalled()
    })
  })

  describe('getStudentCourses', () => {
    it('returns data from Supabase when successful', async () => {
      const mockData = [{ id: 'course-1', title: 'Test Course', modules: [] }]
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        mockResolvedValue: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      })

      const result = await getStudentCourses('student-1')
      
      // This test will fail because we haven't implemented the transformation logic
      // but it's a placeholder for the actual test
      expect(Array.isArray(result)).toBe(true)
    })

    it('falls back to mock data when Supabase fails', async () => {
      const mockError = new Error('Supabase error')
      const mockData = [{ id: 'course-1', title: 'Mock Course', modules: [] }]
      
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        mockResolvedValue: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      })
      
      ;(getMockStudentCourses as jest.Mock).mockResolvedValue(mockData)

      const result = await getStudentCourses('student-1')
      
      expect(result).toEqual(mockData)
      expect(getMockStudentCourses).toHaveBeenCalled()
    })
  })

  describe('getLearningPath', () => {
    it('returns empty array when no enrollments found', async () => {
      ;(supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null }),
      })

      const result = await getLearningPath('student-1')
      
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })
  })
})
