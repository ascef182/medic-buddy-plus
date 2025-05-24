
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types
export type MedicationType = {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  type: string;
  notes?: string;
  quantity: number;
  unit: string;
  times: string[];
  last_taken?: Date | null;
  alert_threshold?: number;
  auto_alert_contact_id?: string | null;
};

export type ContactType = {
  id: string;
  patient_id: string;
  name: string;
  relation: string;
  email?: string;
  phone?: string;
};

export type MoodType = "happy" | "neutral" | "sad" | "anxious" | "afraid" | "tense" | "nervous" | "depressed";

export type MoodEntryType = {
  id: string;
  patient_id: string;
  mood: MoodType;
  notes?: string;
  date: Date;
};

export type PatientProfileType = {
  id: string;
  caregiver_id: string;
  full_name: string;
  age?: string;
  blood_type?: string;
  email?: string;
  password?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export interface MedicationContextType {
  medications: MedicationType[];
  contacts: ContactType[];
  moodEntries: MoodEntryType[];
  patientProfile: PatientProfileType | null;
  selectedPatientId: string | null;
  addMedication: (medication: Omit<MedicationType, "id" | "patient_id">) => Promise<void>;
  updateMedication: (id: string, updates: Partial<MedicationType>) => Promise<void>;
  takeMedication: (id: string) => Promise<void>;
  addContact: (contact: Omit<ContactType, "id" | "patient_id">) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addMoodEntry: (entry: Omit<MoodEntryType, "id" | "patient_id">) => Promise<void>;
  updatePatientProfile: (updates: Partial<PatientProfileType>) => Promise<void>;
  setSelectedPatientId: (id: string | null) => void;
  loadPatientData: (patientId: string) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntryType[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfileType | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    localStorage.getItem("selectedPatientId")
  );

  const loadMedications = async (patientId: string) => {
    try {
      console.log("Loading medications for patient:", patientId);
      const { data, error } = await supabase
        .from("patient_medications")
        .select("*")
        .eq("patient_id", patientId);

      if (error) {
        console.error("Error fetching medications:", error);
        throw error;
      }

      console.log("Medications fetched:", data);
      if (data) {
        setMedications(data.map(med => ({
          ...med,
          last_taken: med.last_taken ? new Date(med.last_taken) : null
        })));
      }
    } catch (error: any) {
      console.error("Failed to load medications:", error);
      toast.error(`Erro ao carregar medicamentos: ${error.message}`);
    }
  };

  const loadContacts = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_contacts")
        .select("*")
        .eq("patient_id", patientId);

      if (error) throw error;
      if (data) setContacts(data);
    } catch (error: any) {
      console.error("Failed to load contacts:", error);
      toast.error(`Erro ao carregar contatos: ${error.message}`);
    }
  };

  const loadMoodEntries = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_mood_entries")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: false });

      if (error) throw error;
      if (data) {
        setMoodEntries(data.map(entry => ({
          ...entry,
          date: new Date(entry.date)
        })));
      }
    } catch (error: any) {
      console.error("Failed to load mood entries:", error);
      toast.error(`Erro ao carregar entradas de humor: ${error.message}`);
    }
  };

  const loadPatientProfile = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (error) throw error;
      if (data) {
        setPatientProfile({
          ...data,
          created_at: data.created_at ? new Date(data.created_at) : undefined,
          updated_at: data.updated_at ? new Date(data.updated_at) : undefined
        });
      }
    } catch (error: any) {
      console.error("Failed to load patient profile:", error);
      toast.error(`Erro ao carregar perfil do paciente: ${error.message}`);
    }
  };

  const loadPatientData = async (patientId: string) => {
    await Promise.all([
      loadMedications(patientId),
      loadContacts(patientId),
      loadMoodEntries(patientId),
      loadPatientProfile(patientId)
    ]);
  };

  const addMedication = async (medication: Omit<MedicationType, "id" | "patient_id">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_medications")
        .insert({
          ...medication,
          patient_id: selectedPatientId
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newMedication = {
          ...data,
          last_taken: data.last_taken ? new Date(data.last_taken) : null
        };
        setMedications(prev => [...prev, newMedication]);
        toast.success("Medicamento adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to add medication:", error);
      toast.error(`Erro ao adicionar medicamento: ${error.message}`);
    }
  };

  const updateMedication = async (id: string, updates: Partial<MedicationType>) => {
    try {
      const { error } = await supabase
        .from("patient_medications")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(med => med.id === id ? { ...med, ...updates } : med)
      );
      toast.success("Medicamento atualizado com sucesso!");
    } catch (error: any) {
      console.error("Failed to update medication:", error);
      toast.error(`Erro ao atualizar medicamento: ${error.message}`);
    }
  };

  const takeMedication = async (id: string) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("patient_medications")
        .update({ 
          last_taken: now,
          quantity: medications.find(m => m.id === id)?.quantity ? 
            Math.max(0, medications.find(m => m.id === id)!.quantity - 1) : 0
        })
        .eq("id", id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(med => 
          med.id === id 
            ? { 
                ...med, 
                last_taken: new Date(now),
                quantity: Math.max(0, med.quantity - 1)
              } 
            : med
        )
      );
      toast.success("Medicamento marcado como tomado!");
    } catch (error: any) {
      console.error("Failed to mark medication as taken:", error);
      toast.error(`Erro ao marcar medicamento: ${error.message}`);
    }
  };

  const addContact = async (contact: Omit<ContactType, "id" | "patient_id">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_contacts")
        .insert({
          ...contact,
          patient_id: selectedPatientId
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setContacts(prev => [...prev, data]);
        toast.success("Contato adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to add contact:", error);
      toast.error(`Erro ao adicionar contato: ${error.message}`);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== id));
      toast.success("Contato removido com sucesso!");
    } catch (error: any) {
      console.error("Failed to delete contact:", error);
      toast.error(`Erro ao remover contato: ${error.message}`);
    }
  };

  const addMoodEntry = async (entry: Omit<MoodEntryType, "id" | "patient_id">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_mood_entries")
        .insert({
          ...entry,
          patient_id: selectedPatientId,
          date: entry.date.toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newEntry = {
          ...data,
          date: new Date(data.date)
        };
        setMoodEntries(prev => [newEntry, ...prev]);
        toast.success("Entrada de humor registrada!");
      }
    } catch (error: any) {
      console.error("Failed to add mood entry:", error);
      toast.error(`Erro ao registrar humor: ${error.message}`);
    }
  };

  const updatePatientProfile = async (updates: Partial<PatientProfileType>) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedPatientId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPatientProfile({
          ...data,
          created_at: data.created_at ? new Date(data.created_at) : undefined,
          updated_at: data.updated_at ? new Date(data.updated_at) : undefined
        });
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to update patient profile:", error);
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    }
  };

  // Load data when selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientData(selectedPatientId);
    } else {
      setMedications([]);
      setContacts([]);
      setMoodEntries([]);
      setPatientProfile(null);
    }
  }, [selectedPatientId]);

  const value: MedicationContextType = {
    medications,
    contacts,
    moodEntries,
    patientProfile,
    selectedPatientId,
    addMedication,
    updateMedication,
    takeMedication,
    addContact,
    deleteContact,
    addMoodEntry,
    updatePatientProfile,
    setSelectedPatientId,
    loadPatientData
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};
