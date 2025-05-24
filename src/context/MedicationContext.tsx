
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type MedicationType = {
  id: string;
  created_at?: string;
  user_id?: string;
  name: string;
  dosage: string;
  frequency: string;
  type: string;
  notes: string | null;
  patient_id: string | null;
  quantity: number;
  unit: string;
  times: string[];
  last_taken?: string | null;
  alert_threshold?: number;
  auto_alert_contact_id?: string | null;
};

export type ContactType = {
  id: string;
  name: string;
  relation: string;
  email: string | null;
  phone: string | null;
  patient_id: string;
};

export type MoodType = "happy" | "neutral" | "sad" | "anxious" | "afraid" | "tense" | "nervous" | "depressed";

export type MoodEntry = {
  id: string;
  date: Date | string;
  mood: MoodType;
  notes: string | null;
  patient_id: string;
};

export type PatientProfileType = {
  id: string;
  full_name: string;
  age?: string;
  blood_type?: string;
  email?: string;
};

interface MedicationContextType {
  medications: MedicationType[];
  addMedication: (medication: Omit<MedicationType, "id" | "user_id" | "created_at">) => Promise<void>;
  fetchMedications: () => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Omit<MedicationType, "id" | "user_id" | "created_at">>) => Promise<void>;
  selectedPatientId: string | null;
  setSelectedPatientId: (patientId: string | null) => void;
  takeMedication: (id: string) => Promise<void>;
  contacts: ContactType[];
  addContact: (contact: Omit<ContactType, "id">) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id" | "patient_id">) => Promise<void>;
  patientProfile: PatientProfileType | null;
  loadPatientData: (patientId: string) => Promise<void>;
  updatePatientProfile: (updates: Partial<PatientProfileType>) => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(
  undefined
);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfileType | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    localStorage.getItem("selectedPatientId")
  );
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMedications();
      if (selectedPatientId) {
        loadPatientData(selectedPatientId);
      }
    }
  }, [user, selectedPatientId]);

  useEffect(() => {
    localStorage.setItem("selectedPatientId", selectedPatientId || "");
  }, [selectedPatientId]);

  const loadPatientData = async (patientId: string) => {
    if (!user) return;

    try {
      // Fetch patient profile
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (patientError) {
        console.error("Error fetching patient profile:", patientError);
        return;
      }

      setPatientProfile(patientData);

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("patient_contacts")
        .select("*")
        .eq("patient_id", patientId);

      if (contactsError) {
        console.error("Error fetching contacts:", contactsError);
      } else {
        setContacts(contactsData || []);
      }

      // Fetch mood entries
      const { data: moodData, error: moodError } = await supabase
        .from("patient_mood_entries")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: false });

      if (moodError) {
        console.error("Error fetching mood entries:", moodError);
      } else {
        // Type cast the mood entries to ensure proper typing
        const typedMoodData = moodData?.map(entry => ({
          ...entry,
          mood: entry.mood as MoodType
        })) || [];
        setMoodEntries(typedMoodData);
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
      toast.error("Erro ao carregar dados do paciente");
    }
  };

  const fetchMedications = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("patient_medications")
        .select("*")

      if (selectedPatientId) {
        query = query.eq("patient_id", selectedPatientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching medications:", error);
        toast.error("Erro ao buscar medicamentos");
        return;
      }

      setMedications(data || []);
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast.error("Erro ao buscar medicamentos");
    }
  };

  const addMedication = async (medicationData: Omit<MedicationType, "id" | "user_id" | "created_at">) => {
    if (!user || !selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patient_medications")
        .insert([{
          ...medicationData,
          patient_id: selectedPatientId
        }]);

      if (error) {
        console.error("Error adding medication:", error);
        toast.error("Erro ao adicionar medicamento");
        return;
      }
      
      toast.success("Medicamento adicionado com sucesso");
      await fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast.error("Erro ao adicionar medicamento");
    }
  };

  const updateMedication = async (id: string, updates: Partial<Omit<MedicationType, "id" | "user_id" | "created_at">>) => {
    try {
      const { error } = await supabase
        .from("patient_medications")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Error updating medication:", error);
        toast.error("Erro ao atualizar medicamento");
        return;
      }

      toast.success("Medicamento atualizado com sucesso");
      await fetchMedications();
    } catch (error) {
      console.error("Error updating medication:", error);
      toast.error("Erro ao atualizar medicamento");
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_medications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting medication:", error);
        toast.error("Erro ao remover medicamento");
        return;
      }

      toast.success("Medicamento removido com sucesso");
      await fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast.error("Erro ao remover medicamento");
    }
  };

  const takeMedication = async (id: string) => {
    try {
      // First get the current medication to update quantity
      const { data, error: fetchError } = await supabase
        .from("patient_medications")
        .select("*")
        .eq("id", id)
        .single();
      
      if (fetchError || !data) {
        console.error("Error fetching medication:", fetchError);
        toast.error("Erro ao registrar medicamento como tomado");
        return;
      }

      // Decrease quantity by 1
      const newQuantity = Math.max(0, (data.quantity || 0) - 1);
      
      const { error } = await supabase
        .from("patient_medications")
        .update({
          last_taken: new Date().toISOString(),
          quantity: newQuantity
        })
        .eq("id", id);

      if (error) {
        console.error("Error marking medication as taken:", error);
        toast.error("Erro ao registrar medicamento como tomado");
        return;
      }

      toast.success("Medicamento registrado como tomado");
      await fetchMedications();
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast.error("Erro ao registrar medicamento como tomado");
    }
  };

  const addContact = async (contactData: Omit<ContactType, "id">) => {
    if (!user || !selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patient_contacts")
        .insert([{
          ...contactData,
          patient_id: selectedPatientId
        }]);

      if (error) {
        console.error("Error adding contact:", error);
        toast.error("Erro ao adicionar contato");
        return;
      }
      
      toast.success("Contato adicionado com sucesso");
      await loadPatientData(selectedPatientId);
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Erro ao adicionar contato");
    }
  };

  const deleteContact = async (id: string) => {
    if (!selectedPatientId) return;
    
    try {
      const { error } = await supabase
        .from("patient_contacts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting contact:", error);
        toast.error("Erro ao remover contato");
        return;
      }

      toast.success("Contato removido com sucesso");
      await loadPatientData(selectedPatientId);
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao remover contato");
    }
  };

  const addMoodEntry = async (entryData: Omit<MoodEntry, "id" | "patient_id">) => {
    if (!user || !selectedPatientId) return;

    try {
      const entry = {
        ...entryData,
        patient_id: selectedPatientId,
        date: new Date(entryData.date).toISOString()
      };

      const { error } = await supabase
        .from("patient_mood_entries")
        .insert([entry]);

      if (error) {
        console.error("Error adding mood entry:", error);
        toast.error("Erro ao registrar humor");
        return;
      }
      
      toast.success("Humor registrado com sucesso");
      await loadPatientData(selectedPatientId);
    } catch (error) {
      console.error("Error adding mood entry:", error);
      toast.error("Erro ao registrar humor");
    }
  };

  const updatePatientProfile = async (updates: Partial<PatientProfileType>) => {
    if (!selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patients")
        .update(updates)
        .eq("id", selectedPatientId);

      if (error) {
        console.error("Error updating patient profile:", error);
        toast.error("Erro ao atualizar perfil do paciente");
        return;
      }

      toast.success("Perfil atualizado com sucesso");
      await loadPatientData(selectedPatientId);
    } catch (error) {
      console.error("Error updating patient profile:", error);
      toast.error("Erro ao atualizar perfil do paciente");
    }
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        fetchMedications,
        deleteMedication,
        updateMedication,
        selectedPatientId,
        setSelectedPatientId,
        takeMedication,
        contacts,
        addContact,
        deleteContact,
        moodEntries,
        addMoodEntry,
        patientProfile,
        loadPatientData,
        updatePatientProfile,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error("useMedication must be used within a MedicationProvider");
  }
  return context;
};
