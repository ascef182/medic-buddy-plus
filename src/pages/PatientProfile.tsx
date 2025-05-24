
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  User, 
  Calendar, 
  Droplet, 
  Phone, 
  Mail, 
  AlertTriangle,
  Plus,
  X,
  Edit3,
  Save
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication, PatientProfileType } from "@/context/MedicationContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AllergyType {
  id: string;
  allergy: string;
}

interface DiagnosisType {
  id: string;
  diagnosis: string;
}

interface ChronicDiseaseType {
  id: string;
  disease: string;
}

const PatientProfile: React.FC = () => {
  const { patientProfile, updatePatientProfile, selectedPatientId } = useMedication();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientProfileType>>({
    full_name: "",
    age: "",
    blood_type: "",
    email: "",
  });
  
  // Medical information states
  const [allergies, setAllergies] = useState<AllergyType[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisType[]>([]);
  const [chronicDiseases, setChronicDiseases] = useState<ChronicDiseaseType[]>([]);
  const [observations, setObservations] = useState("");
  
  // New item states
  const [newAllergy, setNewAllergy] = useState("");
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newDisease, setNewDisease] = useState("");

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        full_name: patientProfile.full_name || "",
        age: patientProfile.age || "",
        blood_type: patientProfile.blood_type || "",
        email: patientProfile.email || "",
      });
    }
    
    if (selectedPatientId) {
      loadMedicalInformation();
    }
  }, [patientProfile, selectedPatientId]);

  const loadMedicalInformation = async () => {
    if (!selectedPatientId) return;

    try {
      // Load allergies
      const { data: allergiesData } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("patient_id", selectedPatientId);
      
      // Load diagnoses
      const { data: diagnosesData } = await supabase
        .from("patient_diagnoses")
        .select("*")
        .eq("patient_id", selectedPatientId);
      
      // Load chronic diseases
      const { data: diseasesData } = await supabase
        .from("patient_chronic_diseases")
        .select("*")
        .eq("patient_id", selectedPatientId);
      
      // Load observations
      const { data: observationsData } = await supabase
        .from("patient_observations")
        .select("*")
        .eq("patient_id", selectedPatientId)
        .single();

      setAllergies(allergiesData || []);
      setDiagnoses(diagnosesData || []);
      setChronicDiseases(diseasesData || []);
      setObservations(observationsData?.observations || "");
    } catch (error: any) {
      console.error("Erro ao carregar informações médicas:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await updatePatientProfile(formData);
    await saveObservations();
    setIsEditing(false);
  };

  const saveObservations = async () => {
    if (!selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patient_observations")
        .upsert({
          patient_id: selectedPatientId,
          observations,
        });

      if (error) throw error;
    } catch (error: any) {
      toast.error(`Erro ao salvar observações: ${error.message}`);
    }
  };

  const addAllergy = async () => {
    if (!newAllergy.trim() || !selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_allergies")
        .insert({
          patient_id: selectedPatientId,
          allergy: newAllergy.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setAllergies(prev => [...prev, data]);
      setNewAllergy("");
      toast.success("Alergia adicionada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar alergia: ${error.message}`);
    }
  };

  const removeAllergy = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_allergies")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAllergies(prev => prev.filter(allergy => allergy.id !== id));
      toast.success("Alergia removida com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover alergia: ${error.message}`);
    }
  };

  const addDiagnosis = async () => {
    if (!newDiagnosis.trim() || !selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_diagnoses")
        .insert({
          patient_id: selectedPatientId,
          diagnosis: newDiagnosis.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setDiagnoses(prev => [...prev, data]);
      setNewDiagnosis("");
      toast.success("Diagnóstico adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar diagnóstico: ${error.message}`);
    }
  };

  const removeDiagnosis = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_diagnoses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setDiagnoses(prev => prev.filter(diagnosis => diagnosis.id !== id));
      toast.success("Diagnóstico removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover diagnóstico: ${error.message}`);
    }
  };

  const addChronicDisease = async () => {
    if (!newDisease.trim() || !selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_chronic_diseases")
        .insert({
          patient_id: selectedPatientId,
          disease: newDisease.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setChronicDiseases(prev => [...prev, data]);
      setNewDisease("");
      toast.success("Doença crônica adicionada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar doença crônica: ${error.message}`);
    }
  };

  const removeChronicDisease = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_chronic_diseases")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setChronicDiseases(prev => prev.filter(disease => disease.id !== id));
      toast.success("Doença crônica removida com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover doença crônica: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfil Médico</h1>
            <p className="text-muted-foreground">
              Informações completas do paciente para emergências
            </p>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
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
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                <Input
                  id="blood_type"
                  name="blood_type"
                  value={formData.blood_type || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Ex: O+, A-, B+, AB-"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
          </CardContent>
        </Card>

        {/* Medical Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alergias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nova alergia..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                />
                <Button size="sm" onClick={addAllergy}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {allergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm">{allergy.allergy}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAllergy(allergy.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {allergies.length === 0 && (
                  <p className="text-muted-foreground text-sm">Nenhuma alergia registrada</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagnoses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-blue-500" />
                Diagnósticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Novo diagnóstico..."
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addDiagnosis()}
                />
                <Button size="sm" onClick={addDiagnosis}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {diagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="text-sm">{diagnosis.diagnosis}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDiagnosis(diagnosis.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {diagnoses.length === 0 && (
                  <p className="text-muted-foreground text-sm">Nenhum diagnóstico registrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chronic Diseases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-orange-500" />
              Doenças Crônicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nova doença crônica..."
                value={newDisease}
                onChange={(e) => setNewDisease(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addChronicDisease()}
              />
              <Button size="sm" onClick={addChronicDisease}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {chronicDiseases.map((disease) => (
                <div key={disease.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">{disease.disease}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeChronicDisease(disease.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {chronicDiseases.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhuma doença crônica registrada</p>
            )}
          </CardContent>
        </Card>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle>Observações Médicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observations">Informações importantes para emergências</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                disabled={!isEditing}
                placeholder="Adicione informações importantes que devem ser conhecidas em caso de emergência..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientProfile;
