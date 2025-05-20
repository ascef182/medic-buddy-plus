
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Clock, User, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import MedicationCard from "@/components/MedicationCard";
import MoodTracker from "@/components/MoodTracker";
import { useMedication } from "@/context/MedicationContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const { medications, patientProfile, selectedPatientId, setSelectedPatientId } = useMedication();
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  const [patients, setPatients] = useState<any[]>([]);
  const [patientMedications, setPatientMedications] = useState<any[]>([]);
  const [patientMoods, setPatientMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };
  
  // Get user's name from metadata
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "";
  
  // Fetch all patients and their medications
  useEffect(() => {
    const fetchPatientsData = async () => {
      if (!user) return;
      
      try {
        // Get all patients for this caregiver
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("*")
          .eq("caregiver_id", user.id)
          .order("full_name");
          
        if (patientsError) throw patientsError;
        
        if (patientsData && patientsData.length > 0) {
          setPatients(patientsData);
          
          // Get medications for each patient individually
          const allMedications = [];
          for (const patient of patientsData) {
            const { data: medsData, error: medsError } = await supabase
              .from("patient_medications")
              .select("*, patient_id")
              .eq("patient_id", patient.id)
              .order("name");
              
            if (medsError) {
              console.error("Error fetching medications for patient:", medsError);
              continue;
            }
            
            if (medsData) {
              const medsWithPatientName = medsData.map(med => ({
                ...med,
                patient_name: patient.full_name
              }));
              allMedications.push(...medsWithPatientName);
            }
          }
          
          setPatientMedications(allMedications || []);
          
          // Get latest mood for each patient
          const moodsPromises = patientsData.map(async (patient) => {
            const { data: moodData, error: moodError } = await supabase
              .from("patient_mood_entries")
              .select("*")
              .eq("patient_id", patient.id)
              .order("date", { ascending: false })
              .limit(1);
              
            if (moodError) {
              console.error("Error fetching mood for patient:", moodError);
              return { patientId: patient.id, mood: null, patientName: patient.full_name };
            }
            
            if (moodData && moodData.length > 0) {
              return {
                patientId: patient.id,
                mood: moodData[0].mood,
                date: moodData[0].date,
                notes: moodData[0].notes,
                patientName: patient.full_name
              };
            }
            
            return { patientId: patient.id, mood: null, patientName: patient.full_name };
          });
          
          const moodsResults = await Promise.all(moodsPromises);
          setPatientMoods(moodsResults);
        }
      } catch (error: any) {
        toast.error(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientsData();
  }, [user]);
  
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.full_name : "Paciente";
  };
  
  const getPatientMood = (patientId: string) => {
    const moodEntry = patientMoods.find(m => m.patientId === patientId);
    return moodEntry?.mood || "Não registrado";
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">
              Olá, {userName}! {getGreeting()}!
            </h2>
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
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Todos os Pacientes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/pacientes")}>
              Gerenciar Pacientes
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-pulse rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : patients.length > 0 ? (
              <div className="space-y-6">
                {patients.map((patient) => (
                  <Card key={patient.id} className="overflow-hidden border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">{patient.full_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-2">Medicamentos</h3>
                          {patientMedications.filter(med => med.patient_id === patient.id).length > 0 ? (
                            <div className="space-y-2">
                              {patientMedications
                                .filter(med => med.patient_id === patient.id)
                                .map((med) => (
                                  <div key={med.id} className="border rounded-md p-3 flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{med.name}</p>
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>{med.times.join(", ")}</span>
                                      </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs ${
                                      med.last_taken && new Date(med.last_taken).toDateString() === new Date().toDateString() 
                                        ? "bg-green-100 text-green-800" 
                                        : "bg-amber-100 text-amber-800"
                                    }`}>
                                      {med.last_taken && new Date(med.last_taken).toDateString() === new Date().toDateString() 
                                        ? "Tomado" 
                                        : "Pendente"}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum medicamento cadastrado</p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Humor do Dia</h3>
                          <div className="border rounded-md p-3">
                            {getPatientMood(patient.id) !== "Não registrado" ? (
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                  getPatientMood(patient.id) === "happy" ? "bg-green-100 text-green-800" :
                                  getPatientMood(patient.id) === "neutral" ? "bg-blue-100 text-blue-800" :
                                  getPatientMood(patient.id) === "sad" ? "bg-amber-100 text-amber-800" :
                                  getPatientMood(patient.id) === "tense" ? "bg-red-100 text-red-800" :
                                  "bg-gray-100 text-gray-800"
                                }`}>
                                  {getPatientMood(patient.id) === "happy" ? "😊" :
                                   getPatientMood(patient.id) === "neutral" ? "😐" :
                                   getPatientMood(patient.id) === "sad" ? "😔" :
                                   getPatientMood(patient.id) === "tense" ? "😠" : "❓"}
                                </div>
                                <span className="font-medium">
                                  {getPatientMood(patient.id) === "happy" ? "Feliz" :
                                   getPatientMood(patient.id) === "neutral" ? "Neutro" :
                                   getPatientMood(patient.id) === "sad" ? "Triste" :
                                   getPatientMood(patient.id) === "tense" ? "Tenso" :
                                   getPatientMood(patient.id)}
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Humor não registrado</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            localStorage.setItem("selectedPatientId", patient.id);
                            setSelectedPatientId(patient.id);
                            navigate("/dashboard");
                          }}
                        >
                          Selecionar paciente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Nenhum paciente cadastrado
                </p>
                <Button onClick={() => navigate("/pacientes/adicionar")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Paciente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedPatientId && (
        <>
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
                      Nenhum medicamento cadastrado para o paciente selecionado
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

            <Button
              variant={patientProfile?.fullName ? "outline" : "default"}
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => navigate("/perfil")}
            >
              <User className="h-6 w-6 mb-2" />
              <span>{patientProfile?.fullName ? "Editar Ficha Médica" : "Criar Ficha Médica"}</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => navigate("/insights")}
            >
              <ChartBar className="h-6 w-6 mb-2" />
              <span>Insights e Análises</span>
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Index;
