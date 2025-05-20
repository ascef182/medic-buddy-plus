
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import MedicationCard from "@/components/MedicationCard";
import { useMedication } from "@/context/MedicationContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const Medications = () => {
  const { medications, selectedPatientId } = useMedication();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allPatientMedications, setAllPatientMedications] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter based on selected patient or search term
  const filteredMedications = selectedPatientId 
    ? medications.filter(
        (medication) =>
          medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPatientMedications.filter(
        (medication) =>
          medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Fetch all medications for all patients when no patient is selected
  useEffect(() => {
    const fetchAllMedications = async () => {
      if (!user) return;
      
      try {
        // Get all patients for this caregiver
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("*")
          .eq("caregiver_id", user.id);
          
        if (patientsError) throw patientsError;
        
        if (patientsData && patientsData.length > 0) {
          setPatients(patientsData);
          
          // Get medications for each patient individually
          const allMeds = [];
          for (const patient of patientsData) {
            const { data: medsData, error: medsError } = await supabase
              .from("patient_medications")
              .select("*")
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
              allMeds.push(...medsWithPatientName);
            }
          }
          setAllPatientMedications(allMeds || []);
        }
      } catch (error: any) {
        toast.error(`Erro ao carregar medicamentos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (!selectedPatientId) {
      fetchAllMedications();
    } else {
      setLoading(false);
    }
  }, [user, selectedPatientId]);
  
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.full_name : "Paciente";
  };
  
  const getMedicationStatus = (medication: any) => {
    if (medication.last_taken && new Date(medication.last_taken).toDateString() === new Date().toDateString()) {
      return { status: "Tomado", class: "bg-green-100 text-green-800" };
    }
    
    // Check if any time has already passed today
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (const time of medication.times) {
      const [hours, minutes] = time.split(':').map(Number);
      
      if (hours < currentHour || (hours === currentHour && minutes <= currentMinute)) {
        return { status: "Pendente", class: "bg-amber-100 text-amber-800" };
      }
    }
    
    return { status: "Agendado", class: "bg-blue-100 text-blue-800" };
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Medicamentos</h1>
        <Button onClick={() => navigate("/medicamentos/adicionar")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar medicamentos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMedications.length > 0 ? (
        <div className="space-y-4">
          {selectedPatientId ? (
            // Display selected patient medications with MedicationCard
            filteredMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))
          ) : (
            // Display all patient medications with custom cards
            filteredMedications.map((medication) => {
              const status = getMedicationStatus(medication);
              
              return (
                <Card key={medication.id} className="overflow-hidden border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{medication.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {medication.type} - {medication.dosage}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                          Paciente: <span className="font-medium">{medication.patient_name || getPatientName(medication.patient_id)}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{medication.times.join(", ")}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${status.class}`}>
                        {status.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Nenhum medicamento encontrado para sua busca"
              : "Nenhum medicamento cadastrado"}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate("/medicamentos/adicionar")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Medicamento
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Medications;
