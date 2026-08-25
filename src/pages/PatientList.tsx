
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, User, Trash2, Edit } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/utils";

interface Patient {
  id: string;
  full_name: string;
  age: string;
  blood_type: string | null;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, full_name, age, blood_type")
          .eq("caregiver_id", user.id)
          .order("full_name");

        if (error) throw error;
        
        if (data) {
          setPatients(data);
        }
      } catch (error: unknown) {
        toast.error(`Erro ao carregar pacientes: ${getErrorMessage(error)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);

  const handleDeletePatient = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${name}?`)) return;

    try {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPatients(patients.filter(p => p.id !== id));
      toast.success(`${name} foi removido(a) com sucesso`);
    } catch (error: unknown) {
      toast.error(`Erro ao excluir paciente: ${getErrorMessage(error)}`);
    }
  };

  const handleSelectPatient = (id: string) => {
    // Store the selected patient ID in localStorage
    localStorage.setItem("selectedPatientId", id);
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Pacientes</h1>
          <Link to="/adicionar-paciente">
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Paciente
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : patients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <Card key={patient.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-6 w-6" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{patient.full_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} anos
                            {patient.blood_type && ` • Tipo ${patient.blood_type}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/editar-paciente/${patient.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id, patient.full_name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleSelectPatient(patient.id)}
                    >
                      Selecionar paciente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-muted/30">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum paciente cadastrado</h3>
            <p className="mt-2 text-muted-foreground">
              Adicione seu primeiro paciente para começar a gerenciar seus medicamentos e cuidados
            </p>
            <Link to="/adicionar-paciente">
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-5 w-5" />
                Adicionar Paciente
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientList;
