
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { useMedication, PatientProfile } from "@/context/MedicationContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const { patientProfile, updatePatientProfile } = useMedication();

  const [profile, setProfile] = useState<PatientProfile>({
    fullName: "",
    age: "",
    bloodType: "",
    allergies: [],
    chronicDiseases: [],
    recentDiagnosis: [],
    doctors: [],
    observations: "",
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    phone: "",
  });

  // Initialize with existing data if available
  useEffect(() => {
    if (patientProfile) {
      setProfile(patientProfile);
    }
  }, [patientProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientProfile(profile);
    navigate("/");
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setProfile({
        ...profile,
        allergies: [...profile.allergies, newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = [...profile.allergies];
    updatedAllergies.splice(index, 1);
    setProfile({
      ...profile,
      allergies: updatedAllergies,
    });
  };

  const addChronicDisease = () => {
    if (newDisease.trim()) {
      setProfile({
        ...profile,
        chronicDiseases: [...profile.chronicDiseases, newDisease.trim()],
      });
      setNewDisease("");
    }
  };

  const removeChronicDisease = (index: number) => {
    const updatedDiseases = [...profile.chronicDiseases];
    updatedDiseases.splice(index, 1);
    setProfile({
      ...profile,
      chronicDiseases: updatedDiseases,
    });
  };

  const addRecentDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setProfile({
        ...profile,
        recentDiagnosis: [...profile.recentDiagnosis, newDiagnosis.trim()],
      });
      setNewDiagnosis("");
    }
  };

  const removeRecentDiagnosis = (index: number) => {
    const updatedDiagnosis = [...profile.recentDiagnosis];
    updatedDiagnosis.splice(index, 1);
    setProfile({
      ...profile,
      recentDiagnosis: updatedDiagnosis,
    });
  };

  const addDoctor = () => {
    if (newDoctor.name.trim() && newDoctor.specialty.trim()) {
      setProfile({
        ...profile,
        doctors: [...profile.doctors, { ...newDoctor }],
      });
      setNewDoctor({
        name: "",
        specialty: "",
        phone: "",
      });
    }
  };

  const removeDoctor = (index: number) => {
    const updatedDoctors = [...profile.doctors];
    updatedDoctors.splice(index, 1);
    setProfile({
      ...profile,
      doctors: updatedDoctors,
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Ficha Médica do Paciente</h1>
        <p className="text-muted-foreground">
          Preencha as informações médicas do paciente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                <Select 
                  value={profile.bloodType} 
                  onValueChange={(value) => setProfile({ ...profile, bloodType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o tipo sanguíneo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alergias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Adicionar alergia"
                className="flex-1"
              />
              <Button type="button" onClick={addAllergy}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map((allergy, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {allergy}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeAllergy(index)}
                  />
                </Badge>
              ))}
              {profile.allergies.length === 0 && (
                <span className="text-sm text-muted-foreground">Nenhuma alergia cadastrada</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Doenças Crônicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newDisease}
                onChange={(e) => setNewDisease(e.target.value)}
                placeholder="Adicionar doença crônica"
                className="flex-1"
              />
              <Button type="button" onClick={addChronicDisease}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.chronicDiseases.map((disease, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {disease}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeChronicDisease(index)}
                  />
                </Badge>
              ))}
              {profile.chronicDiseases.length === 0 && (
                <span className="text-sm text-muted-foreground">Nenhuma doença crônica cadastrada</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnósticos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                placeholder="Adicionar diagnóstico recente"
                className="flex-1"
              />
              <Button type="button" onClick={addRecentDiagnosis}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.recentDiagnosis.map((diagnosis, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {diagnosis}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRecentDiagnosis(index)}
                  />
                </Badge>
              ))}
              {profile.recentDiagnosis.length === 0 && (
                <span className="text-sm text-muted-foreground">Nenhum diagnóstico recente cadastrado</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Médicos Responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                placeholder="Nome"
              />
              <Input
                value={newDoctor.specialty}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                placeholder="Especialidade"
              />
              <Input
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                placeholder="Telefone"
              />
            </div>
            <Button type="button" onClick={addDoctor} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Médico
            </Button>
            
            {profile.doctors.length > 0 ? (
              <div className="space-y-2 mt-4">
                {profile.doctors.map((doctor, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-muted-foreground flex gap-2">
                        <span>{doctor.specialty}</span>
                        {doctor.phone && (
                          <>
                            <span>•</span>
                            <span>{doctor.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDoctor(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-2">
                Nenhum médico cadastrado
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={profile.observations}
              onChange={(e) => setProfile({ ...profile, observations: e.target.value })}
              placeholder="Restrições alimentares, uso de aparelho auditivo, etc."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Salvar Ficha Médica
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default PatientProfilePage;
