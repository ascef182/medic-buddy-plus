
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import MedicationCard from "@/components/MedicationCard";
import MoodTracker from "@/components/MoodTracker";
import { useMedication } from "@/context/MedicationContext";

const Index = () => {
  const { medications } = useMedication();
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Olá!</h2>
            <p className="text-muted-foreground">
              <span className="capitalize">{currentDate}</span>
            </p>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Medicamentos para Hoje</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/medicamentos")}>
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <div>
                {medications.slice(0, 3).map((medication) => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Nenhum medicamento cadastrado
                </p>
                <Button
                  onClick={() => navigate("/medicamentos/adicionar")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Medicamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <MoodTracker />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center"
          onClick={() => navigate("/medicamentos/adicionar")}
        >
          <PlusCircle className="h-6 w-6 mb-2" />
          <span>Adicionar Medicamento</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center"
          onClick={() => navigate("/contatos")}
        >
          <PlusCircle className="h-6 w-6 mb-2" />
          <span>Gerenciar Contatos</span>
        </Button>
      </div>
    </Layout>
  );
};

export default Index;
