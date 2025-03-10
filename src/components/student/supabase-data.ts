import { supabase } from '../../lib/supabase'
import { Student, Course, Module, Lesson, Certificate } from './types'
import { getStudentProfile as getMockStudentProfile, getStudentCourses as getMockStudentCourses } from './mock-data'

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
 * Fetch student certificates from Supabase
 * Falls back to mock data if Supabase fetch fails
 */
export async function getStudentCertificates(studentId: string = 'student-1'): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', studentId)
    
    if (error) throw error
    return data as Certificate[]
  } catch (error) {
    console.error('Error fetching student certificates:', error)
    // Fallback to mock data
    const student = await getMockStudentProfile()
    return student.certificates
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
