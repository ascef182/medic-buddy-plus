
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeMessageProps {
  userName: string;
  hasPatients: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName, hasPatients }) => {
  if (hasPatients) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Bem-vindo(a), {userName}!</h1>
        </div>
        <p className="text-muted-foreground">
          Aqui está um resumo dos seus pacientes e atividades de hoje.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Heart className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo(a) ao BuddyDoctor, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Seu assistente de cuidados para idosos está pronto para ajudar.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para começar, adicione seu primeiro paciente e comece a gerenciar 
              medicamentos, consultas e o bem-estar de quem você cuida.
            </p>
            
            <Link to="/adicionar-paciente">
              <Button className="w-full" size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Adicionar Primeiro Paciente
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeMessage;
