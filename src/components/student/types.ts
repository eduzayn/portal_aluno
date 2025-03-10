export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  certificates: Certificate[];
  enrolledCourses?: number;
  completedCourses?: number;
  certificatesEarned?: number;
  currentProgress?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  modules: Module[];
  imageUrl?: string;
  duration?: string;
  totalModules?: number;
  totalLessons?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  lessons: Lesson[];
  courseId?: string;
  order?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  order?: number;
  completed?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  downloadUrl: string;
  certificateUrl?: string;
}

export interface FinancialRecord {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentDate: Date | null;
  status: 'paid' | 'pending' | 'overdue' | 'future';
  receiptUrl: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}
