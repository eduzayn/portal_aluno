export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  certificates: Certificate[];
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
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}

export interface Certificate {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  downloadUrl: string;
}
