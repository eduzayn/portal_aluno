import { supabase } from '../../lib/supabase'
import { Student, Course, Module, Lesson, Certificate, FinancialRecord } from './types'
import { getStudentProfile as getMockStudentProfile, getStudentCourses as getMockStudentCourses } from './mock-data'

// Fetch student profile
export async function getStudentProfile(studentId: string = 'student-1'): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching student profile:', error)
    // Fallback to mock data
    return getMockStudentProfile()
  }
}

// Fetch student courses
export async function getStudentCourses(studentId: string = 'student-1'): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        course_id,
        courses:course_id (
          id,
          title,
          description,
          image_url,
          instructor,
          start_date,
          end_date,
          total_modules,
          total_lessons
        )
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    
    // Transform the data to match our Course type
    return data.map((enrollment: any) => ({
      id: enrollment.courses.id,
      title: enrollment.courses.title,
      description: enrollment.courses.description,
      imageUrl: enrollment.courses.image_url,
      instructor: enrollment.courses.instructor,
      startDate: enrollment.courses.start_date,
      endDate: enrollment.courses.end_date,
      progress: 0, // We'll need to calculate this separately
      status: 'in_progress', // Default status
      modules: [], // Will be populated separately if needed
      totalModules: enrollment.courses.total_modules,
      totalLessons: enrollment.courses.total_lessons
    }))
  } catch (error) {
    console.error('Error fetching student courses:', error)
    // Fallback to mock data
    return getMockStudentCourses()
  }
}

// Fetch course progress
export async function getCourseProgress(studentId: string, courseId: string): Promise<number> {
  try {
    const { data: completedLessons, error: completedError } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .eq('completed', true)
    
    if (completedError) throw completedError
    
    const { data: totalLessons, error: totalError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)
    
    if (totalError) throw totalError
    
    if (totalLessons.length === 0) return 0
    return (completedLessons.length / totalLessons.length) * 100
  } catch (error) {
    console.error('Error calculating course progress:', error)
    return Math.floor(Math.random() * 100) // Return random progress for mock data
  }
}

// Fetch learning path
export async function getLearningPath(studentId: string): Promise<Module[]> {
  try {
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', studentId)
    
    if (enrollmentError) throw enrollmentError
    
    if (!enrollments.length) return []
    
    const courseIds = enrollments.map(e => e.course_id)
    
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select(`
        id,
        title,
        description,
        course_id,
        order,
        duration,
        status,
        lessons:lessons (
          id,
          title,
          description,
          duration,
          order,
          type,
          status
        )
      `)
      .in('course_id', courseIds)
      .order('order')
    
    if (modulesError) throw modulesError
    
    // Transform the data to match our Module type
    return modules.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      duration: module.duration,
      status: module.status || 'available',
      courseId: module.course_id,
      order: module.order,
      lessons: module.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        type: lesson.type || 'video',
        status: lesson.status || 'available',
        order: lesson.order,
        completed: lesson.status === 'completed'
      })).sort((a: any, b: any) => a.order - b.order)
    }))
  } catch (error) {
    console.error('Error fetching learning path:', error)
    // Return empty array for now - would implement mock data fallback in production
    return []
  }
}

// Fetch certificates
export async function getStudentCertificates(studentId: string): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        id,
        title,
        course_id,
        courses:course_id (title),
        issue_date,
        expiry_date,
        certificate_url
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    
    // Transform the data to match our Certificate type
    return data.map((cert: any) => ({
      id: cert.id,
      title: cert.title,
      courseId: cert.course_id,
      courseName: cert.courses.title,
      issueDate: cert.issue_date,
      expiryDate: cert.expiry_date,
      downloadUrl: cert.certificate_url,
      certificateUrl: cert.certificate_url
    }))
  } catch (error) {
    console.error('Error fetching certificates:', error)
    // Return empty array for now - would implement mock data fallback in production
    return []
  }
}

// Fetch financial records
export async function getFinancialRecords(studentId: string): Promise<FinancialRecord[]> {
  try {
    const { data, error } = await supabase
      .from('financial_records')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: false })
    
    if (error) throw error
    
    // Transform the data to match our FinancialRecord type
    return data.map((record: any) => ({
      id: record.id,
      description: record.description,
      amount: record.amount,
      dueDate: new Date(record.due_date),
      paymentDate: record.payment_date ? new Date(record.payment_date) : null,
      status: record.status,
      receiptUrl: record.receipt_url
    }))
  } catch (error) {
    console.error('Error fetching financial records:', error)
    // Return empty array for now - would implement mock data fallback in production
    return []
  }
}

// Helper function to use Supabase or fall back to mock data
export async function useSupabaseOrMock<T>(
  supabaseFunction: () => Promise<T>,
  mockFunction: () => Promise<T>
): Promise<T> {
  try {
    // Try to use Supabase first
    return await supabaseFunction()
  } catch (error) {
    console.warn('Falling back to mock data:', error)
    // Fall back to mock data if Supabase fails
    return await mockFunction()
  }
}
