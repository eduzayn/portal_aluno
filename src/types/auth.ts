export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'instructor' | 'student';
  avatar_url?: string;
}

import { AccessLevel } from './payment-access';

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  accessLevel: AccessLevel;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role?: 'student';
}
