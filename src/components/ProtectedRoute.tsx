
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import Loading from "@/components/Loading";
import { checkMissedMedications } from "@/utils/automaticAlerts";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingPatients, setCheckingPatients] = useState(true);
  const [hasPatients, setHasPatients] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const checkPatients = async () => {
        try {
          const { data, error, count } = await supabase
            .from("patients")
            .select("id", { count: 'exact' })
            .eq("caregiver_id", user.id)
            .limit(1);

          if (error) throw error;
          
          setHasPatients(count !== null && count > 0);
          
          // If current route is not add patient and user has no patients, redirect
          if (count === 0 && window.location.pathname !== "/adicionar-paciente" && 
              window.location.pathname !== "/pacientes") {
            toast.info("Por favor, adicione um paciente para começar");
            navigate("/adicionar-paciente");
          }
        } catch (error: any) {
          console.error("Erro ao verificar pacientes:", error);
        } finally {
          setCheckingPatients(false);
        }
      };

      checkPatients();
      
      // Check for missed medications when the app loads
      const checkAlerts = async () => {
        try {
          const missedMedications = await checkMissedMedications();
          
          if (missedMedications && missedMedications.length > 0) {
            toast.warning(
              `${missedMedications.length} medicamento(s) não tomado(s). Alertas enviados automaticamente.`,
              { duration: 5000 }
            );
          }
        } catch (error) {
          console.error("Erro ao verificar alertas de medicamentos:", error);
        }
      };
      
      // Run once on load
      checkAlerts();
      
      // Set up periodic check every 15 minutes
      const intervalId = setInterval(checkAlerts, 15 * 60 * 1000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user, navigate]);

  if (loading || checkingPatients) {
    return <Loading />;
  }

  return <>{user ? children : null}</>;
};

export default ProtectedRoute;
