import { supabase } from '../../lib/supabase'
import { Student, Course, Certificate, FinancialRecord } from './types'
import { getStudentProfile as getMockStudentProfile, getCourses } from './mock-data'

// Alias for getCourses to maintain compatibility
const getMockStudentCourses = getCourses

/**
 * Fetch student profile from Supabase
 * Falls back to mock data if Supabase fetch fails
 */
export async function getStudentProfile(studentId: string = 'student-1'): Promise<Student> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*, certificates(*)')
      .eq('id', studentId)
      .single()
    
    if (error) throw error
    return data as Student
  } catch (error) {
    console.error('Error fetching student profile:', error)
    // Fallback to mock data
    return getMockStudentProfile()
  }
}

/**
 * Fetch student courses from Supabase
 * Falls back to mock data if Supabase fetch fails
 */
export async function getStudentCourses(studentId: string = 'student-1'): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        courses:course_id(
          id, 
          title, 
          description, 
          imageUrl, 
          duration, 
          totalModules, 
          totalLessons,
          modules:modules(
            id, 
            title, 
            description, 
            duration, 
            status,
            order,
            lessons:lessons(
              id, 
              title, 
              description, 
              duration, 
              type, 
              status,
              order,
              completed
            )
          )
        ),
        progress,
        status
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    
    // Transform the data to match the Course type
    const courses = data.map((enrollment: any) => ({
      id: enrollment.courses.id,
      title: enrollment.courses.title,
      description: enrollment.courses.description,
      imageUrl: enrollment.courses.imageUrl,
      duration: enrollment.courses.duration,
      totalModules: enrollment.courses.totalModules,
      totalLessons: enrollment.courses.totalLessons,
      progress: enrollment.progress,
      status: enrollment.status,
      modules: enrollment.courses.modules
    }))
    
    return courses as Course[]
  } catch (error) {
    console.error('Error fetching student courses:', error)
    // Fallback to mock data
    return getMockStudentCourses()
  }
}

/**
 * Fetch course progress from Supabase
 * Falls back to random progress if Supabase fetch fails
 */
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

/**
 * Fetch learning path from Supabase
 * Falls back to empty array if Supabase fetch fails
 */
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

/**
 * Fetch student certificates from Supabase
 * Falls back to mock data if Supabase fetch fails
 */
export async function getStudentCertificates(studentId: string = 'student-1'): Promise<Certificate[]> {
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
    // Fallback to mock data
    const student = await getMockStudentProfile()
    return student.certificates
  }
}

/**
 * Fetch financial records from Supabase
 * Falls back to empty array if Supabase fetch fails
 */
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

/**
 * Update course progress in Supabase
 */
export async function updateCourseProgress(
  studentId: string,
  courseId: string,
  progress: number,
  status: 'not_started' | 'in_progress' | 'completed'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('enrollments')
      .update({ progress, status })
      .eq('student_id', studentId)
      .eq('course_id', courseId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating course progress:', error)
    throw error
  }
}

/**
 * Update lesson status in Supabase
 */
export async function updateLessonStatus(
  lessonId: string,
  status: 'locked' | 'available' | 'in_progress' | 'completed',
  completed: boolean = false
): Promise<void> {
  try {
    const { error } = await supabase
      .from('lessons')
      .update({ status, completed })
      .eq('id', lessonId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating lesson status:', error)
    throw error
  }
}

/**
 * Helper function to use Supabase or fall back to mock data
 */
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
