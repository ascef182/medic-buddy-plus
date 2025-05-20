
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isPatient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPatient, setIsPatient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!');
          
          // Check if the user is a patient
          const isPatientUser = session?.user?.user_metadata?.patient_id !== undefined;
          setIsPatient(isPatientUser);
          
          // Redirect to appropriate dashboard
          if (isPatientUser) {
            navigate("/paciente/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info('Logout realizado com sucesso!');
          // Clear localStorage patient selection on logout
          localStorage.removeItem("selectedPatientId");
          navigate("/auth");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          // Check if user is a patient
          setIsPatient(session.user.user_metadata?.patient_id !== undefined);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is a patient
        setIsPatient(session.user.user_metadata?.patient_id !== undefined);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("selectedPatientId");
    } catch (error: any) {
      toast.error(`Erro ao fazer logout: ${error.message}`);
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    isPatient
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
