
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, Clock, CheckCircle, MessageCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";
import Loading from "@/components/Loading";
import PatientMoodTracker from "@/components/PatientMoodTracker";
import MedicationTakeButton from "@/components/MedicationTakeButton";

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [sendingEmergency, setSendingEmergency] = useState(false);
  const patientId = user?.user_metadata?.patient_id;
  const patientName = user?.user_metadata?.full_name;
  
  const fetchPatientData = async () => {
    if (!patientId) return;
    
    try {
      // Fetch patient medications
      const { data: medsData, error: medsError } = await supabase
        .from("patient_medications")
        .select("*")
        .eq("patient_id", patientId);
        
      if (medsError) throw medsError;
      
      setMedications(medsData || []);
      
      // Fetch emergency contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("patient_contacts")
        .select("*")
        .eq("patient_id", patientId);
        
      if (contactsError) throw contactsError;
      
      setEmergencyContacts(contactsData || []);
    } catch (error: any) {
      toast.error(`Erro ao carregar dados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatientData();
  }, [patientId]);
  
  const handleMedicationTaken = () => {
    // Recarregar os dados do medicamento
    fetchPatientData();
  };
  
  const handleEmergencySignal = async () => {
    if (!patientId) return;
    
    if (confirm("Tem certeza que deseja enviar um sinal de emergência para seus contatos?")) {
      setSendingEmergency(true);
      try {
        const { error } = await supabase
          .from("patient_emergency_signals")
          .insert({
            patient_id: patientId,
            message: "Preciso de ajuda urgente!",
          });
          
        if (error) throw error;
        
        toast.success("Sinal de emergência enviado com sucesso!");
      } catch (error: any) {
        toast.error(`Erro ao enviar sinal de emergência: ${error.message}`);
      } finally {
        setSendingEmergency(false);
      }
    }
  };
  
  if (loading) return <Loading />;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">BuddyDoctor</h1>
          </div>
          <div>
            <span className="text-sm text-muted-foreground mr-2">Olá, {patientName}</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="shadow-md border-red-500 border-2">
              <CardHeader className="bg-red-50 border-b border-red-200">
                <CardTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Botão de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-muted-foreground">
                  Use este botão apenas em caso de emergência real. Seus contatos serão notificados imediatamente.
                </p>
                <Button
                  variant="destructive"
                  className="w-full py-6 text-lg font-bold"
                  disabled={sendingEmergency}
                  onClick={handleEmergencySignal}
                >
                  {sendingEmergency ? "Enviando..." : "EMERGÊNCIA"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Meu Humor</CardTitle>
              </CardHeader>
              <CardContent>
                <PatientMoodTracker patientId={patientId} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Meus Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {medications.length > 0 ? (
                  <div className="space-y-4">
                    {medications.map((med) => (
                      <Card key={med.id} className="overflow-hidden border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{med.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {med.type} - {med.dosage}
                              </p>
                              <div className="flex items-center mt-2 text-sm">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{med.times && med.times[0]}</span>
                              </div>
                            </div>
                            
                            <MedicationTakeButton 
                              medication={med}
                              patientId={patientId}
                              onMedicationTaken={handleMedicationTaken}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4">
                    Nenhum medicamento encontrado
                  </p>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Contatos de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emergencyContacts.length > 0 ? (
                    <div className="space-y-2">
                      {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.relation}</p>
                          </div>
                          <div>
                            {contact.phone && (
                              <p className="text-sm">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4">
                      Nenhum contato de emergência cadastrado
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
