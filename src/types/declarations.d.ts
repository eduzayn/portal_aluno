// Type declarations for modules without type definitions

declare module '@edunexia/core' {
  export function createOpenAPIConfig(config: any): any;
  // Add other exports as needed
}

declare module 'swagger-jsdoc';
declare module 'swagger-ui-react';
declare module 'qrcode.react';
declare module 'jspdf';
declare module 'html2canvas';

// Declare modules for local imports that TypeScript can't find
declare module '../../components/ui/ServerErrorHandler';
declare module '../../styles/colors' {
  export const colors: Record<string, string>;
}
declare module './colors' {
  export const colors: Record<string, string>;
}
declare module './utils' {
  export function cn(...inputs: any[]): string;
}
declare module '@/components/ui/Tabs' {
  export const Tabs: React.FC<any>;
  export const TabsList: React.FC<any>;
  export const TabsTrigger: React.FC<any>;
  export const TabsContent: React.FC<any>;
}
