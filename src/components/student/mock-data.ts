import { Student, Course, Certificate, StudentCredential, AcademicDocument, FinancialRecord } from './types';

export const getStudentProfile = async (): Promise<Student> => {
  return {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    enrollmentNumber: '2023001',
    course: 'Desenvolvimento Web Full Stack',
    semester: 2,
    profileImage: '/images/avatars/avatar-1.png',
    certificates: [
      {
        id: '1',
        courseId: '101',
        courseName: 'Introdução ao HTML e CSS',
        issueDate: '2023-03-15',
        downloadUrl: '/certificates/cert1.pdf',
      },
      {
        id: '2',
        courseId: '102',
        courseName: 'JavaScript Básico',
        issueDate: '2023-05-20',
        downloadUrl: '/certificates/cert2.pdf',
      },
    ],
    enrolledCourses: 3,
    completedCourses: 1,
    certificatesEarned: 2,
    currentProgress: 65,
    hasValidCredential: true
  };
};

export const getCourses = async (): Promise<Course[]> => {
  return [
    {
      id: '1',
      title: 'Introdução ao HTML e CSS',
      description: 'Aprenda os fundamentos de HTML e CSS para criar páginas web estáticas.',
      instructor: 'Maria Oliveira',
      duration: '20 horas',
      progress: 100,
      thumbnail: '/images/courses/html-css.jpg',
      status: 'completed',
      startDate: '2023-01-10',
      endDate: '2023-02-15',
      category: 'Front-end',
      tags: ['HTML', 'CSS', 'Web'],
      rating: 4.8,
      enrollmentDate: '2023-01-05',
      lastAccessed: '2023-02-15',
    },
    {
      id: '2',
      title: 'JavaScript Básico',
      description: 'Aprenda os conceitos básicos de JavaScript para tornar suas páginas web interativas.',
      instructor: 'Carlos Mendes',
      duration: '25 horas',
      progress: 85,
      thumbnail: '/images/courses/javascript.jpg',
      status: 'in-progress',
      startDate: '2023-02-20',
      endDate: '2023-04-10',
      category: 'Front-end',
      tags: ['JavaScript', 'Web', 'Programação'],
      rating: 4.5,
      enrollmentDate: '2023-02-18',
      lastAccessed: '2023-03-25',
    },
    {
      id: '3',
      title: 'React.js Fundamentos',
      description: 'Aprenda a criar aplicações web modernas com React.js.',
      instructor: 'Ana Souza',
      duration: '30 horas',
      progress: 20,
      thumbnail: '/images/courses/react.jpg',
      status: 'in-progress',
      startDate: '2023-03-15',
      endDate: '2023-05-20',
      category: 'Front-end',
      tags: ['React', 'JavaScript', 'Web', 'Framework'],
      rating: 4.9,
      enrollmentDate: '2023-03-10',
      lastAccessed: '2023-03-22',
    },
    {
      id: '4',
      title: 'Node.js e Express',
      description: 'Aprenda a criar APIs RESTful com Node.js e Express.',
      instructor: 'Roberto Alves',
      duration: '35 horas',
      progress: 0,
      thumbnail: '/images/courses/nodejs.jpg',
      status: 'not-started',
      startDate: '2023-05-10',
      endDate: '2023-07-15',
      category: 'Back-end',
      tags: ['Node.js', 'Express', 'API', 'JavaScript'],
      rating: 4.7,
      enrollmentDate: '2023-04-30',
      lastAccessed: null,
    },
  ];
};

export const getCertificates = async (): Promise<Certificate[]> => {
  return [
    {
      id: '1',
      courseId: '101',
      courseName: 'Introdução ao HTML e CSS',
      issueDate: '2023-03-15',
      downloadUrl: '/certificates/cert1.pdf',
    },
    {
      id: '2',
      courseId: '102',
      courseName: 'JavaScript Básico',
      issueDate: '2023-05-20',
      downloadUrl: '/certificates/cert2.pdf',
    },
  ];
};

/**
 * Mock student credential data
 */
export const getStudentCredential = async (studentId: string): Promise<StudentCredential | null> => {
  // Simular que o aluno ainda não tem credencial
  return null;
};

/**
 * Mock check credential eligibility
 */
export const checkCredentialEligibility = async (studentId: string): Promise<boolean> => {
  // Simular que o aluno é elegível para credencial
  return true;
};

/**
 * Mock upsert student credential
 */
export const upsertStudentCredential = async (credential: Partial<StudentCredential>): Promise<StudentCredential | null> => {
  return {
    id: '1',
    studentId: credential.studentId || '1',
    photoUrl: credential.photoUrl || '/images/avatars/avatar-1.png',
    qrCodeData: credential.qrCodeData || 'abc123xyz',
    issueDate: credential.issueDate || new Date().toISOString(),
    expiryDate: credential.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: credential.status || 'active'
  };
};

/**
 * Mock academic documents data
 */
export const getAcademicDocuments = async (studentId: string, documentType?: 'grade_history' | 'enrollment_declaration' | 'course_completion'): Promise<AcademicDocument[]> => {
  const allDocuments = [
    {
      id: '1',
      studentId: studentId,
      documentType: 'enrollment_declaration' as const,
      title: 'Declaração de Matrícula',
      fileUrl: '/documents/enrollment-declaration.pdf',
      issueDate: '2023-01-20T14:30:00Z',
      metadata: {
        semester: '2023.1'
      }
    },
    {
      id: '2',
      studentId: studentId,
      documentType: 'grade_history' as const,
      title: 'Histórico de Notas',
      fileUrl: '/documents/grade-history.pdf',
      issueDate: '2023-06-25T09:15:00Z',
      metadata: {
        semester: '2023.1',
        courses: ['Introdução à Programação']
      }
    },
    {
      id: '3',
      studentId: studentId,
      documentType: 'course_completion' as const,
      title: 'Declaração de Conclusão - Introdução à Programação',
      fileUrl: '/documents/course-completion-programming.pdf',
      issueDate: '2023-06-20T16:45:00Z',
      metadata: {
        courseId: '1',
        courseName: 'Introdução à Programação',
        completionDate: '2023-06-20',
        grade: 9.5
      }
    }
  ];

  if (documentType) {
    return allDocuments.filter(doc => doc.documentType === documentType);
  }

  return allDocuments;
};

/**
 * Alias for getCourses to maintain compatibility
 */
export const getStudentCourses = getCourses;

/**
 * Mock financial records data
 */
export const getFinancialRecords = async (studentId: string): Promise<FinancialRecord[]> => {
  return [
    {
      id: '1',
      description: 'Mensalidade Janeiro/2023',
      amount: 499.90,
      dueDate: new Date('2023-01-10'),
      paymentDate: new Date('2023-01-08'),
      status: 'paid',
      receiptUrl: '/receipts/payment-jan-2023.pdf'
    },
    {
      id: '2',
      description: 'Mensalidade Fevereiro/2023',
      amount: 499.90,
      dueDate: new Date('2023-02-10'),
      paymentDate: new Date('2023-02-09'),
      status: 'paid',
      receiptUrl: '/receipts/payment-feb-2023.pdf'
    },
    {
      id: '3',
      description: 'Mensalidade Março/2023',
      amount: 499.90,
      dueDate: new Date('2023-03-10'),
      paymentDate: null,
      status: 'pending',
      receiptUrl: null
    }
  ];
};
