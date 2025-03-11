import { supabase } from '../../lib/supabase'
import {
  getStudentProfile,
  getStudentCourses,
  getStudentCertificates,
  updateStudentProfile
} from './supabase-data'

// Mock the supabase module
jest.mock('../../lib/supabase')

describe('Student Supabase Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup mock implementations
    const mockFrom = jest.fn().mockReturnThis()
    const mockSelect = jest.fn().mockReturnThis()
    const mockEq = jest.fn().mockReturnThis()
    const mockSingle = jest.fn().mockReturnThis()
    const mockData = jest.fn()
    const mockError = jest.fn()
    
    // Configure the supabase mock
    ;(supabase.from as jest.Mock).mockImplementation(() => ({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      update: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      data: mockData,
      error: mockError,
    }))
  })
  
  describe('getStudentProfile', () => {
    it('fetches student profile data', async () => {
      // Mock the response data
      const mockProfileData = {
        id: 'student-1',
        name: 'Test Student',
        email: 'test@example.com',
        enrollmentDate: '2023-01-15',
        status: 'active'
      }
      
      // Setup the mock implementation
      ;(supabase.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfileData,
          error: null
        })
      }))
      
      // Call the function
      const result = await getStudentProfile('student-1')
      
      // Verify the result
      expect(result).toEqual(mockProfileData)
      expect(supabase.from).toHaveBeenCalledWith('profiles')
    })
  })
})
