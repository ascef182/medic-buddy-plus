
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/lib/utils";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateUser: (data: { email?: string; password?: string; data?: Record<string, unknown> }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  enableTwoFactor: () => Promise<void>;
  disableTwoFactor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
          // Redirect to saved URL or home page
          const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        } else if (event === 'SIGNED_OUT') {
          toast.info('Logout realizado com sucesso!');
          // Clear localStorage patient selection on logout
          localStorage.removeItem("selectedPatientId");
          navigate("/auth");
        } else if (event === 'PASSWORD_RECOVERY') {
          // Redirect to password reset form
          navigate('/auth/reset-password');
        } else if (event === 'USER_UPDATED') {
          toast.success('Informações do usuário atualizadas com sucesso!');
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("selectedPatientId");
      // Não precisamos redirecionar aqui, pois o evento SIGNED_OUT será capturado pelo listener
    } catch (error: unknown) {
      toast.error(`Erro ao fazer logout: ${getErrorMessage(error)}`);
    }
  };

  const updateUser = async (data: { email?: string; password?: string; data?: Record<string, unknown> }) => {
    try {
      const { error } = await supabase.auth.updateUser(data);
      
      if (error) throw error;
      
      toast.success('Informações atualizadas com sucesso!');
    } catch (error: unknown) {
      toast.error(`Erro ao atualizar informações: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Instruções de redefinição de senha enviadas para seu email.');
    } catch (error: unknown) {
      toast.error(`Erro ao solicitar redefinição de senha: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const enableTwoFactor = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para ativar a autenticação de dois fatores.');
      return;
    }
    
    try {
      // TODO(supabase-recreate): set_two_factor_enabled isn't in the generated
      // Database types yet (the Supabase project is being recreated). Once
      // types.ts is regenerated against the new project this cast can go away.
      const { error } = await (
        supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ error: unknown }>
      )('set_two_factor_enabled', { 
        enabled: true 
      });
      
      if (error) throw error;
      
      toast.success('Autenticação de dois fatores ativada com sucesso!');
    } catch (error: unknown) {
      toast.error(`Erro ao ativar autenticação de dois fatores: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const disableTwoFactor = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para desativar a autenticação de dois fatores.');
      return;
    }
    
    try {
      // TODO(supabase-recreate): set_two_factor_enabled isn't in the generated
      // Database types yet (the Supabase project is being recreated). Once
      // types.ts is regenerated against the new project this cast can go away.
      const { error } = await (
        supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ error: unknown }>
      )('set_two_factor_enabled', { 
        enabled: false 
      });
      
      if (error) throw error;
      
      toast.success('Autenticação de dois fatores desativada com sucesso!');
    } catch (error: unknown) {
      toast.error(`Erro ao desativar autenticação de dois fatores: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    updateUser,
    requestPasswordReset,
    enableTwoFactor,
    disableTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
