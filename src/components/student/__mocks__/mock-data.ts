// Mock data for student components tests
export const getStudentProfile = jest.fn().mockReturnValue({
  id: 'student-1',
  name: 'Test Student',
  email: 'test@example.com',
  enrollmentDate: '2023-01-15',
  status: 'active',
  certificates: []
});

export const getStudentCourses = jest.fn().mockReturnValue([
  {
    id: 'course-1',
    title: 'Test Course 1',
    description: 'Test Course Description 1',
    progress: 75,
    image: '/images/course1.jpg',
    modules: 8,
    completedModules: 6,
    instructor: 'Test Instructor',
    category: 'Development',
    lastAccessed: '2023-05-10'
  },
  {
    id: 'course-2',
    title: 'Test Course 2',
    description: 'Test Course Description 2',
    progress: 30,
    image: '/images/course2.jpg',
    modules: 10,
    completedModules: 3,
    instructor: 'Another Instructor',
    category: 'Design',
    lastAccessed: '2023-05-08'
  }
]);

export const getLearningPaths = jest.fn().mockReturnValue([
  {
    id: 'path1',
    title: 'Test Path 1',
    description: 'Test Description 1',
    modules: [
      {
        id: 'module1',
        title: 'Test Module 1',
        description: 'Test Module Description 1',
        duration: '2 weeks',
        status: 'completed',
        lessons: [
          {
            id: 'lesson1',
            title: 'Test Lesson 1',
            description: 'Test Lesson Description 1',
            duration: '30 min',
            type: 'video',
            status: 'completed',
          },
        ],
      },
    ],
  },
  {
    id: 'path2',
    title: 'Test Path 2',
    description: 'Test Description 2',
    modules: [],
  },
]);
