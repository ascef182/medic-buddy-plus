import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ListChecks, BarChartBig, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication } from "@/context/MedicationContext";

const Index = () => {
  const navigate = useNavigate();
  const { patientProfile } = useMedication();

  return (
    <Layout>
      {patientProfile && (
        <p className="text-muted-foreground mb-6">
          Bem-vindo(a), {patientProfile.full_name}!
        </p>
      )}

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {patientProfile?.full_name && (
          <>
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
                  variant="secondary"
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
                  variant="secondary"
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
                  variant="secondary"
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
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => navigate("/contatos")}
                >
                  Ver Contatos
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
