
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ChevronDown, PlusCircle, User } from "lucide-react";
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

  useEffect(() => {
    if (!user) return;
    
    const fetchPatients = async () => {
      try {
        console.log("Fetching patients for user:", user.id);
        const { data, error } = await supabase
          .from("patients")
          .select("id, full_name")
          .eq("caregiver_id", user.id)
          .order("full_name");

        if (error) {
          console.error("Error fetching patients:", error);
          throw error;
        }
        
        console.log("Patients fetched:", data);
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
              localStorage.setItem("selectedPatientId", data[0].id);
              loadPatientData(data[0].id);
            }
          } else if (data.length > 0) {
            // No selected ID but we have patients, select the first one
            setSelectedPatient(data[0]);
            onPatientSelect(data[0].id);
            setSelectedPatientId(data[0].id);
            localStorage.setItem("selectedPatientId", data[0].id);
            loadPatientData(data[0].id);
          }
        }
      } catch (error: any) {
        console.error("Failed to load patients:", error);
        toast.error(`Erro ao carregar pacientes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user, selectedPatientId, onPatientSelect, setSelectedPatientId, loadPatientData]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient.id);
    setSelectedPatientId(patient.id);
    localStorage.setItem("selectedPatientId", patient.id);
    loadPatientData(patient.id);
    toast.success(`Paciente ${patient.full_name} selecionado com sucesso!`);
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
      <Link to="/adicionar-paciente">
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
        <Link to="/pacientes" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            Gerenciar pacientes
          </DropdownMenuItem>
        </Link>
        <Link to="/adicionar-paciente" className="w-full">
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
