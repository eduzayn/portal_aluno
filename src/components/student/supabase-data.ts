import { supabase } from '../../lib/supabase';
import { Student, Course, Module, Lesson, Certificate, StudentCredential, AcademicDocument } from './types';
import { getStudentProfile as getMockStudentProfile, getStudentCourses as getMockStudentCourses } from './mock-data';

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
      .single();
    
    if (error) throw error;
    
    // Check if student has a valid credential
    const hasCredential = await getStudentCredential(studentId) !== null;
    
    return {
      ...data as Student,
      hasValidCredential: hasCredential
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    // Fallback to mock data
    return getMockStudentProfile();
  }
}

/**
 * Fetch student credential from Supabase
 */
export async function getStudentCredential(studentId: string): Promise<StudentCredential | null> {
  try {
    const { data, error } = await supabase
      .from('student_credentials')
      .select('*')
      .eq('student_id', studentId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      studentId: data.student_id,
      photoUrl: data.photo_url,
      qrCodeData: data.qr_code_data,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      status: data.status
    };
  } catch (error) {
    console.error('Error fetching student credential:', error);
    return null;
  }
}

/**
 * Create or update student credential
 */
export async function upsertStudentCredential(
  credential: Omit<StudentCredential, 'id' | 'qrCodeData'>
): Promise<StudentCredential | null> {
  try {
    // Generate QR code data (unique identifier + timestamp + student ID)
    const qrCodeData = `${crypto.randomUUID()}_${Date.now()}_${credential.studentId}`;
    
    const { data, error } = await supabase
      .from('student_credentials')
      .upsert({
        student_id: credential.studentId,
        photo_url: credential.photoUrl,
        qr_code_data: qrCodeData,
        issue_date: credential.issueDate,
        expiry_date: credential.expiryDate,
        status: credential.status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'student_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      studentId: data.student_id,
      photoUrl: data.photo_url,
      qrCodeData: data.qr_code_data,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      status: data.status
    };
  } catch (error) {
    console.error('Error creating/updating student credential:', error);
    return null;
  }
}

/**
 * Fetch academic documents from Supabase
 */
export async function getAcademicDocuments(
  studentId: string,
  documentType?: 'grade_history' | 'enrollment_declaration' | 'course_completion'
): Promise<AcademicDocument[]> {
  try {
    let query = supabase
      .from('academic_documents')
      .select('*')
      .eq('student_id', studentId);
    
    if (documentType) {
      query = query.eq('document_type', documentType);
    }
    
    const { data, error } = await query.order('issue_date', { ascending: false });
    
    if (error) throw error;
    
    return data.map((doc: any) => ({
      id: doc.id,
      studentId: doc.student_id,
      documentType: doc.document_type,
      title: doc.title,
      fileUrl: doc.file_url,
      issueDate: doc.issue_date,
      expiryDate: doc.expiry_date,
      metadata: doc.metadata
    }));
  } catch (error) {
    console.error('Error fetching academic documents:', error);
    return [];
  }
}

/**
 * Create academic document
 */
export async function createAcademicDocument(
  document: Omit<AcademicDocument, 'id'>
): Promise<AcademicDocument | null> {
  try {
    const { data, error } = await supabase
      .from('academic_documents')
      .insert({
        student_id: document.studentId,
        document_type: document.documentType,
        title: document.title,
        file_url: document.fileUrl,
        issue_date: document.issueDate,
        expiry_date: document.expiryDate,
        metadata: document.metadata
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      studentId: data.student_id,
      documentType: data.document_type,
      title: data.title,
      fileUrl: data.file_url,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error creating academic document:', error);
    return null;
  }
}

/**
 * Verify if student is eligible for credential
 * (has complete documentation and at least one payment)
 */
export async function checkCredentialEligibility(studentId: string): Promise<boolean> {
  try {
    // Check if student has complete profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (profileError || !profile) return false;
    
    // Check if student has at least one payment
    const { data: payments, error: paymentsError } = await supabase
      .from('financial_records')
      .select('id')
      .eq('student_id', studentId)
      .eq('status', 'paid')
      .limit(1);
    
    if (paymentsError) return false;
    
    return payments.length > 0;
  } catch (error) {
    console.error('Error checking credential eligibility:', error);
    return false;
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
          instructor,
          startDate,
          endDate,
          modules:modules(
            id, 
            title, 
            description, 
            duration, 
            status,
            lessons:lessons(
              id, 
              title, 
              description, 
              duration, 
              type, 
              status
            )
          )
        ),
        progress,
        status
      `)
      .eq('student_id', studentId);
    
    if (error) throw error;
    
    // Transform the data to match the Course type
    const courses = data.map((enrollment: any) => ({
      id: enrollment.courses.id,
      title: enrollment.courses.title,
      description: enrollment.courses.description,
      instructor: enrollment.courses.instructor,
      startDate: enrollment.courses.startDate,
      endDate: enrollment.courses.endDate,
      progress: enrollment.progress,
      status: enrollment.status,
      modules: enrollment.courses.modules
    }));
    
    return courses as Course[];
  } catch (error) {
    console.error('Error fetching student courses:', error);
    // Fallback to mock data
    return getMockStudentCourses();
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
        download_url
      `)
      .eq('student_id', studentId);
    
    if (error) throw error;
    
    // Transform the data to match our Certificate type
    return data.map((cert: any) => ({
      id: cert.id,
      title: cert.title,
      courseId: cert.course_id,
      courseName: cert.courses.title,
      issueDate: cert.issue_date,
      expiryDate: cert.expiry_date,
      downloadUrl: cert.download_url
    }));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    // Fallback to mock data
    const student = await getMockStudentProfile();
    return student.certificates;
  }
}
