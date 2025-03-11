import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
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
        setState({ user: null, loading: false, error: 'Falha ao verificar sessão' });
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

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, resetPassword }}>
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
