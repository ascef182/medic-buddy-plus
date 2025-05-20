
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { ChevronDown, PlusCircle, User, Settings, FileMedical, Pill, Users, HeartPulse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useMedication } from "@/context/MedicationContext";

interface Patient {
  id: string;
  full_name: string;
}

interface PatientSelectorProps {
  selectedPatientId: string | null;
  onPatientSelect: (id: string) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ 
  selectedPatientId,
  onPatientSelect
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { user } = useAuth();
  const { setSelectedPatientId, loadPatientData } = useMedication();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("id, full_name")
          .eq("caregiver_id", user.id)
          .order("full_name");

        if (error) throw error;
        
        if (data) {
          setPatients(data);
          
          // Set selected patient based on selectedPatientId
          if (selectedPatientId) {
            const selected = data.find(p => p.id === selectedPatientId);
            if (selected) {
              setSelectedPatient(selected);
            } else if (data.length > 0) {
              // If selected ID doesn't exist but we have patients, select the first one
              setSelectedPatient(data[0]);
              onPatientSelect(data[0].id);
              setSelectedPatientId(data[0].id);
              loadPatientData(data[0].id);
            }
          } else if (data.length > 0) {
            // No selected ID but we have patients, select the first one or from localStorage
            const storedPatientId = localStorage.getItem("selectedPatientId");
            const patientToSelect = storedPatientId ? 
              data.find(p => p.id === storedPatientId) || data[0] : 
              data[0];
              
            setSelectedPatient(patientToSelect);
            onPatientSelect(patientToSelect.id);
            setSelectedPatientId(patientToSelect.id);
            loadPatientData(patientToSelect.id);
          }
        }
      } catch (error: any) {
        toast.error(`Erro ao carregar pacientes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, selectedPatientId, onPatientSelect, setSelectedPatientId, loadPatientData, navigate]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient.id);
    setSelectedPatientId(patient.id);
    localStorage.setItem("selectedPatientId", patient.id);
    loadPatientData(patient.id);
    toast.success(`Paciente ${patient.full_name} selecionado com sucesso!`);
  };

  const navigateToManagePatient = () => {
    if (!selectedPatient) return;
    
    navigate(`/perfil?id=${selectedPatient.id}`);
  };

  const navigateToMedications = () => {
    if (!selectedPatient) return;
    
    navigate(`/medicamentos`);
  };
  
  const navigateToContacts = () => {
    if (!selectedPatient) return;
    
    navigate(`/contatos`);
  };
  
  const navigateToMood = () => {
    if (!selectedPatient) return;
    
    navigate(`/humor`);
  };

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <div className="animate-pulse">Carregando pacientes...</div>
      </Button>
    );
  }

  if (patients.length === 0) {
    return (
      <Link to="/pacientes/adicionar">
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" />
          Adicionar Paciente
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="max-w-[150px] truncate">
            {selectedPatient?.full_name || "Selecionar paciente"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {patients.map((patient) => (
          <DropdownMenuItem
            key={patient.id}
            onClick={() => handlePatientSelect(patient)}
            className="cursor-pointer"
          >
            <span className={selectedPatientId === patient.id ? "font-medium" : ""}>
              {patient.full_name}
            </span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {selectedPatient && (
          <>
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={navigateToManagePatient}
            >
              <FileMedical className="mr-2 h-4 w-4" />
              Ficha médica
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={navigateToMedications}
            >
              <Pill className="mr-2 h-4 w-4" />
              Gerenciar medicamentos
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={navigateToContacts}
            >
              <Users className="mr-2 h-4 w-4" />
              Contatos de emergência
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={navigateToMood}
            >
              <HeartPulse className="mr-2 h-4 w-4" />
              Registro de humor
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
          </>
        )}
        
        <Link to="/pacientes" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar pacientes
          </DropdownMenuItem>
        </Link>
        
        <Link to="/pacientes/adicionar" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar paciente
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PatientSelector;
