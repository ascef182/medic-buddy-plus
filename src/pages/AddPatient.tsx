
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const AddPatient: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("patients")
        .insert([
          {
            caregiver_id: user.id,
            full_name: fullName,
            age,
            blood_type: bloodType || null,
            email: createAccount ? email : null,
            password: createAccount // Indica que uma conta deve ser criada
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (createAccount && email) {
        // Se escolheu criar conta, enviamos uma atualização especial para acionar o trigger
        const { error: updateError } = await supabase
          .from("patients")
          .update({ 
            email: email, 
            password: true  // Sinal para o trigger criar a conta
          })
          .eq("id", data.id);
          
        if (updateError) throw updateError;
        
        toast.success(`Paciente ${fullName} adicionado com sucesso e conta de acesso criada!`);
      } else {
        toast.success(`Paciente ${fullName} adicionado com sucesso!`);
      }
      
      // Vamos definir este paciente como o selecionado
      localStorage.setItem("selectedPatientId", data.id);
      navigate("/pacientes");
    } catch (error: any) {
      toast.error(`Erro ao adicionar paciente: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Adicionar Paciente</CardTitle>
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
              
              <div className="flex items-center space-x-2 pt-3">
                <Switch
                  id="createAccount"
                  checked={createAccount}
                  onCheckedChange={setCreateAccount}
                />
                <Label htmlFor="createAccount">Criar conta de acesso para o paciente</Label>
              </div>
              
              {createAccount && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email do paciente</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={createAccount}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha inicial</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={createAccount}
                      placeholder="Senha para o paciente"
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Um email será enviado ao paciente com as instruções de acesso.
                    </p>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/pacientes")}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (createAccount && (!validateEmail(email) || password.length < 6))}
                >
                  {isLoading ? "Adicionando..." : "Adicionar Paciente"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPatient;
