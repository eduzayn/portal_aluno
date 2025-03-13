'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        // Check for temporary user in localStorage
        const tempUserJson = localStorage.getItem('portal_aluno_temp_user');
        if (tempUserJson) {
          const tempUser = JSON.parse(tempUserJson);
          setState({
            user: tempUser,
            loading: false,
            error: null,
          });
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Buscar perfil do usuário
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setState({
            user: {
              id: user.id,
              email: user.email!,
              name: profile?.name || user.email!.split('@')[0],
              role: profile?.role || 'student',
              avatar_url: profile?.avatar_url,
            },
            loading: false,
            error: null,
          });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setState({ user: null, loading: false, error: null });
      }
    };

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Atualizar estado com o usuário logado
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || session.user.email!.split('@')[0],
            role: profile?.role || 'student',
            avatar_url: profile?.avatar_url,
          },
          loading: false,
          error: null,
        });
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false, error: null });
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Login attempt with:', credentials.email);
      
      // Check for temporary user credentials
      if (credentials.email === 'teste@edunexia.com.br' && credentials.password === 'Teste@123') {
        console.log('Using test credentials, creating temporary user session');
        
        // Create a temporary user profile
        const tempUser: UserProfile = {
          id: 'temp-user-id',
          email: 'teste@edunexia.com.br',
          name: 'Usuário Temporário',
          role: 'student',
          avatar_url: undefined,
        };
        
        // Update state with temporary user
        setState({
          user: tempUser,
          loading: false,
          error: null,
        });
        
        // Store session in localStorage to persist across page loads
        localStorage.setItem('portal_aluno_temp_user', JSON.stringify(tempUser));
        
        // Set a cookie for the middleware to detect with a longer expiration
        document.cookie = 'portal_aluno_temp_user=true; path=/; max-age=86400';
        
        console.log('Temporary user session created, redirecting to dashboard...');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 100);
        
        return { success: true };
      }
      
      // Regular authentication flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setState({ ...state, error: error.message });
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      setState({ ...state, error: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      // Registrar usuário
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setState({ ...state, error: error.message });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: credentials.email,
              name: credentials.name,
              role: credentials.role || 'student',
            },
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          return { success: true, error: 'Conta criada, mas houve um erro ao configurar o perfil' };
        }
      }

      return { success: true };
    } catch (error: any) {
      setState({ ...state, error: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    // Clear temporary user from localStorage
    localStorage.removeItem('portal_aluno_temp_user');
    // Clear the cookie
    document.cookie = 'portal_aluno_temp_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    await supabase.auth.signOut();
    router.push('/login');
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  const refreshUserData = async () => {
    if (!state.user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', state.user.id)
        .single();
        
      if (profile) {
        setState({
          ...state,
          user: {
            ...state.user,
            name: profile.name || state.user.email.split('@')[0],
            role: profile.role || 'student',
            avatar_url: profile.avatar_url,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
