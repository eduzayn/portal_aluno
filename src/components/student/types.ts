export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  course: string;
  semester: number;
  profileImage: string;
  certificates: Certificate[];
  enrolledCourses?: number;
  completedCourses?: number;
  certificatesEarned?: number;
  currentProgress?: number;
  hasValidCredential?: boolean;
  academicDocuments?: AcademicDocument[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  thumbnail: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'not_started' | 'in_progress';
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  rating: number;
  enrollmentDate: string;
  lastAccessed: string | null;
  modules?: Module[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  downloadUrl: string;
  title?: string;
}

export interface StudentCredential {
  id: string;
  studentId: string;
  photoUrl: string | null;
  qrCodeData: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface AcademicDocument {
  id: string;
  studentId: string;
  documentType: 'enrollment_declaration' | 'grade_history' | 'course_completion';
  title: string;
  fileUrl: string | null;
  issueDate: string;
  expiryDate?: string;
  metadata: {
    semester?: string;
    courses?: string[];
    courseId?: string;
    courseName?: string;
    completionDate?: string;
    grade?: number;
  };
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentDate: Date | null;
  status: 'paid' | 'pending' | 'overdue';
  receiptUrl: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  status: 'completed' | 'in_progress' | 'not_started' | 'locked' | 'available';
}
