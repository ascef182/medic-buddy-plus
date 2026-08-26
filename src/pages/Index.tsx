
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ListChecks, BarChartBig, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication } from "@/context/MedicationContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import WelcomeMessage from "@/components/dashboard/WelcomeMessage";
import DashboardStats from "@/components/dashboard/DashboardStats";

const Index = () => {
  const navigate = useNavigate();
  const { patientProfile } = useMedication();
  const { user } = useAuth();
  const [totalPatients, setTotalPatients] = useState(0);
  const [userName, setUserName] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Get user name
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        setUserName(userData?.name || user.email?.split("@")[0] || "Usuário");

        // Get total patients count
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("id, full_name")
          .eq("caregiver_id", user.id);

        if (patientsError) throw patientsError;
        setTotalPatients(patientsData?.length || 0);

        // Get selected patient name from localStorage
        const selectedPatientId = localStorage.getItem("selectedPatientId");
        if (selectedPatientId && patientsData) {
          const selectedPatient = patientsData.find(p => p.id === selectedPatientId);
          if (selectedPatient) {
            setSelectedPatientName(selectedPatient.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName(user.email?.split("@")[0] || "Usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const hasPatients = totalPatients > 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-sm">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!hasPatients ? (
        <WelcomeMessage userName={userName} hasPatients={false} />
      ) : (
        <div className="px-2 sm:px-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg font-bold">Bem-vindo, {userName}!</h1>
            </div>
            <p className="text-muted-foreground text-xs mb-3">
              Resumo dos seus pacientes e atividades de hoje.
            </p>
          </div>

          <DashboardStats totalPatients={totalPatients} />

          {selectedPatientName && (
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 mb-4">
              <h2 className="text-sm font-semibold text-primary">
                Paciente: {selectedPatientName}
              </h2>
              <p className="text-xs text-muted-foreground">
                Informações do paciente selecionado
              </p>
            </div>
          )}

          <div className="grid gap-3 mb-6 grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <ListChecks className="h-3 w-3" />
                  <span className="hidden sm:inline">Medicamentos</span>
                  <span className="sm:hidden">Med.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="hidden sm:inline">Acompanhe seus medicamentos</span>
                  <span className="sm:hidden">Medicamentos</span>
                </p>
                <Button
                  className="w-full text-xs h-8"
                  onClick={() => navigate("/medicamentos")}
                >
                  <span className="hidden sm:inline">Ver Medicamentos</span>
                  <span className="sm:hidden">Ver</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span className="hidden sm:inline">Consultas</span>
                  <span className="sm:hidden">Cons.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="hidden sm:inline">Gerencie consultas</span>
                  <span className="sm:hidden">Consultas</span>
                </p>
                <Button
                  className="w-full text-xs h-8"
                  onClick={() => navigate("/consultas")}
                >
                  <span className="hidden sm:inline">Ver Consultas</span>
                  <span className="sm:hidden">Ver</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <BarChartBig className="h-3 w-3" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="hidden sm:inline">Histórico e bem-estar</span>
                  <span className="sm:hidden">Histórico</span>
                </p>
                <Button
                  className="w-full text-xs h-8"
                  onClick={() => navigate("/insights")}
                >
                  <span className="hidden sm:inline">Ver Insights</span>
                  <span className="sm:hidden">Ver</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xs">
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">Contatos</span>
                  <span className="sm:hidden">Cont.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="hidden sm:inline">Gerencie contatos</span>
                  <span className="sm:hidden">Contatos</span>
                </p>
                <Button
                  className="w-full text-xs h-8"
                  onClick={() => navigate("/contatos")}
                >
                  <span className="hidden sm:inline">Ver Contatos</span>
                  <span className="sm:hidden">Ver</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
