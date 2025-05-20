
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Patient {
  id: string;
  full_name: string;
  age: string;
  blood_type: string | null;
}

const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;
    
    const fetchPatient = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .eq("id", id)
          .eq("caregiver_id", user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name);
          setAge(data.age || "");
          setBloodType(data.blood_type || "");
        }
      } catch (error: any) {
        toast.error(`Erro ao carregar dados do paciente: ${error.message}`);
        navigate("/pacientes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [user, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          full_name: fullName,
          age,
          blood_type: bloodType || null,
        })
        .eq("id", id)
        .eq("caregiver_id", user.id);

      if (error) throw error;

      toast.success(`Paciente atualizado com sucesso!`);
      navigate("/pacientes");
    } catch (error: any) {
      toast.error(`Erro ao atualizar paciente: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Editar Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo sanguíneo (opcional)</Label>
                <Input
                  id="bloodType"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/pacientes")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditPatient;
