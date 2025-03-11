import { createOpenAPIConfig } from '@edunexia/core';
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
