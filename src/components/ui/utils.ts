// Mock utils file for TypeScript compilation
export function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ');
}
