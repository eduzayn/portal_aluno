// Mock implementation for @edunexia/core
const createOpenAPIConfig = (config: any) => {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: config.title,
        description: config.description,
        version: config.version,
      },
      servers: [
        {
          url: '/api',
          description: 'API Server',
        },
      ],
    },
    apis: config.apis,
  };
};

import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

/**
 * OpenAPI configuration for the Student Portal
 */
const options = createOpenAPIConfig({
  moduleId: 'student',
  title: 'Student Portal API',
  description: 'API for the Student Portal of the EduNexia Platform',
  version: '1.0.0',
  apis: [
    path.join(process.cwd(), 'src', 'app', 'api', '**', '*.ts'),
    path.join(process.cwd(), 'src', 'types', '*.ts'),
  ],
});

/**
 * Generated OpenAPI specification
 */
export const spec = swaggerJsdoc(options);
