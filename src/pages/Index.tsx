
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
          <div className="animate-pulse">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {!hasPatients ? (
        <WelcomeMessage userName={userName} hasPatients={false} />
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-2xl font-bold">Bem-vindo(a), {userName}!</h1>
            </div>
            <p className="text-muted-foreground mb-4">
              Aqui está um resumo dos seus pacientes e atividades de hoje.
            </p>
            {selectedPatientName && (
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mb-6">
                <h2 className="text-lg font-semibold text-primary">
                  Paciente: {selectedPatientName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  As informações abaixo referem-se ao paciente selecionado
                </p>
              </div>
            )}
          </div>

          <DashboardStats totalPatients={totalPatients} />

          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acompanhe seus medicamentos diários
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate("/medicamentos")}
                >
                  Ver Medicamentos
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas consultas e compromissos
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate("/consultas")}
                >
                  Ver Consultas
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartBig className="h-4 w-4 mr-2" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acompanhe seu histórico e bem-estar
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate("/insights")}
                >
                  Ver Insights
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4 mr-2" />
                  Contatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicione e gerencie seus contatos
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => navigate("/contatos")}
                >
                  Ver Contatos
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Index;
