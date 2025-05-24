import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, User, Calendar, Droplet, Phone, Mail } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication, PatientProfileType } from "@/context/MedicationContext";

const PatientProfile: React.FC = () => {
  const { patientProfile, updatePatientProfile } = useMedication();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientProfileType>>({
    full_name: "",
    age: "",
    blood_type: "",
    email: "",
  });

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        full_name: patientProfile.full_name || "",
        age: patientProfile.age || "",
        blood_type: patientProfile.blood_type || "",
        email: patientProfile.email || "",
      });
    }
  }, [patientProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updatePatientProfile(formData);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ficha Médica</h1>
        <p className="text-muted-foreground">
          Visualize e edite suas informações pessoais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">
                <User className="mr-2 h-4 w-4 inline-block align-middle" />
                Nome Completo
              </Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="age">
                <Calendar className="mr-2 h-4 w-4 inline-block align-middle" />
                Idade
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blood_type">
                <Droplet className="mr-2 h-4 w-4 inline-block align-middle" />
                Tipo Sanguíneo
              </Label>
              <Input
                id="blood_type"
                name="blood_type"
                value={formData.blood_type || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">
                <Mail className="mr-2 h-4 w-4 inline-block align-middle" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: patientProfile?.full_name || "",
                    age: patientProfile?.age || "",
                    blood_type: patientProfile?.blood_type || "",
                    email: patientProfile?.email || "",
                  });
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PatientProfile;
