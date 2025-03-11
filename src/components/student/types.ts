export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber?: string;
  course?: string;
  semester?: number;
  profileImage?: string;
  certificates?: Certificate[];
  enrolledCourses?: number;
  completedCourses?: number;
  certificatesEarned?: number;
  currentProgress?: number;
  hasValidCredential?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  thumbnail: string;
  status: 'not-started' | 'in-progress' | 'completed';
  modules?: Module[];
  startDate?: string;
  endDate?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  enrollmentDate?: string;
  lastAccessed?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: string;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
  completed: boolean;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  downloadUrl: string;
}

export interface StudentCredential {
  id: string;
  studentId: string;
  photoUrl: string;
  qrCodeData: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface AcademicDocument {
  id: string;
  studentId: string;
  documentType: 'grade_history' | 'enrollment_declaration' | 'course_completion';
  title: string;
  fileUrl: string;
  issueDate: string;
  metadata: Record<string, any>;
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
