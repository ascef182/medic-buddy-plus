import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

// Enhanced MedicationType with all required fields
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
  last_taken?: string | null;
  alert_threshold?: number;
  auto_alert_contact_id?: string | null;
  
  // New fields for enhanced medication management
  dose_per_intake: number;
  start_date: string;
  end_date?: string | null;
  expiry_date?: string | null;
  is_recurring: boolean;
  stock_alert_threshold: number;
  restock_history: RestockEntry[];
};

export type RestockEntry = {
  id: string;
  medication_id: string;
  quantity_added: number;
  new_expiry_date?: string | null;
  restock_date: string;
  notes?: string;
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
  date: string;
};

// Export alias for compatibility
export type MoodEntry = MoodEntryType;

export type PatientProfileType = {
  id: string;
  caregiver_id: string;
  full_name: string;
  age?: string;
  blood_type?: string;
  email?: string;
  password?: boolean;
  created_at?: string;
  updated_at?: string;
};

export interface MedicationContextType {
  medications: MedicationType[];
  contacts: ContactType[];
  moodEntries: MoodEntryType[];
  patientProfile: PatientProfileType | null;
  selectedPatientId: string | null;
  addMedication: (medication: Omit<MedicationType, "id" | "patient_id" | "restock_history">) => Promise<void>;
  updateMedication: (id: string, updates: Partial<MedicationType>) => Promise<void>;
  takeMedication: (id: string) => Promise<void>;
  restockMedication: (id: string, quantity: number, newExpiryDate?: Date, notes?: string) => Promise<void>;
  getNextDoseTime: (medication: MedicationType) => Date | null;
  getMedicationStatus: (medication: MedicationType) => 'on_time' | 'low_stock' | 'expiring_soon' | 'overdue' | 'expired';
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

  // Helper function to calculate next dose time
  const getNextDoseTime = (medication: MedicationType): Date | null => {
    if (!medication.last_taken || medication.times.length === 0) {
      return null;
    }

    const lastTaken = new Date(medication.last_taken);
    const today = new Date();
    
    // Find next time based on frequency
    const frequencyHours = parseFrequency(medication.frequency);
    if (!frequencyHours) return null;

    const nextDose = new Date(lastTaken.getTime() + (frequencyHours * 60 * 60 * 1000));
    return nextDose;
  };

  // Helper function to parse frequency into hours
  const parseFrequency = (frequency: string): number | null => {
    const freq = frequency.toLowerCase();
    if (freq.includes('8 horas') || freq.includes('8h')) return 8;
    if (freq.includes('12 horas') || freq.includes('12h')) return 12;
    if (freq.includes('24 horas') || freq.includes('1x ao dia') || freq.includes('diário')) return 24;
    if (freq.includes('2x ao dia')) return 12;
    if (freq.includes('3x ao dia')) return 8;
    if (freq.includes('4x ao dia')) return 6;
    return null;
  };

  // Helper function to get medication status
  const getMedicationStatus = (medication: MedicationType): 'on_time' | 'low_stock' | 'expiring_soon' | 'overdue' | 'expired' => {
    const now = new Date();
    
    // Check if expired
    if (medication.expiry_date && new Date(medication.expiry_date) < now) {
      return 'expired';
    }
    
    // Check if expiring soon (7 days)
    if (medication.expiry_date) {
      const daysUntilExpiry = Math.ceil((new Date(medication.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 7) {
        return 'expiring_soon';
      }
    }
    
    // Check if low stock
    const daysOfStock = Math.floor(medication.quantity / medication.dose_per_intake);
    if (daysOfStock <= medication.stock_alert_threshold) {
      return 'low_stock';
    }
    
    // Check if overdue
    const nextDose = getNextDoseTime(medication);
    if (nextDose && nextDose < now) {
      return 'overdue';
    }
    
    return 'on_time';
  };

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
        // Convert Supabase data to MedicationType with proper type casting
        const typedMedications: MedicationType[] = data.map(med => ({
          ...med,
          dose_per_intake: med.dose_per_intake || 1,
          start_date: med.start_date || new Date().toISOString().split('T')[0],
          end_date: med.end_date || null,
          expiry_date: med.expiry_date || null,
          is_recurring: med.is_recurring || false,
          stock_alert_threshold: med.stock_alert_threshold || 5,
          restock_history: Array.isArray(med.restock_history) ? med.restock_history as RestockEntry[] : []
        }));
        setMedications(typedMedications);
      }
    } catch (error: unknown) {
      console.error("Failed to load medications:", error);
      toast.error(`Erro ao carregar medicamentos: ${getErrorMessage(error)}`);
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
    } catch (error: unknown) {
      console.error("Failed to load contacts:", error);
      toast.error(`Erro ao carregar contatos: ${getErrorMessage(error)}`);
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
          mood: entry.mood as MoodType,
          date: entry.date
        })));
      }
    } catch (error: unknown) {
      console.error("Failed to load mood entries:", error);
      toast.error(`Erro ao carregar entradas de humor: ${getErrorMessage(error)}`);
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
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined
        });
      }
    } catch (error: unknown) {
      console.error("Failed to load patient profile:", error);
      toast.error(`Erro ao carregar perfil do paciente: ${getErrorMessage(error)}`);
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

  const addMedication = async (medication: Omit<MedicationType, "id" | "patient_id" | "restock_history">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_medications")
        .insert({
          ...medication,
          patient_id: selectedPatientId,
          last_taken: medication.last_taken || null,
          start_date: medication.start_date,
          end_date: medication.end_date || null,
          expiry_date: medication.expiry_date || null
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newMedication: MedicationType = {
          ...data,
          dose_per_intake: data.dose_per_intake || 1,
          start_date: data.start_date || new Date().toISOString().split('T')[0],
          end_date: data.end_date || null,
          expiry_date: data.expiry_date || null,
          is_recurring: data.is_recurring || false,
          stock_alert_threshold: data.stock_alert_threshold || 5,
          restock_history: []
        };
        setMedications(prev => [...prev, newMedication]);
        toast.success("Medicamento adicionado com sucesso!");
      }
    } catch (error: unknown) {
      console.error("Failed to add medication:", error);
      toast.error(`Erro ao adicionar medicamento: ${getErrorMessage(error)}`);
    }
  };

  const updateMedication = async (id: string, updates: Partial<MedicationType>) => {
    try {
      const updateData = { ...updates };
      delete updateData.patient_id;
      delete updateData.restock_history;

      const { error } = await supabase
        .from("patient_medications")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(med => med.id === id ? { ...med, ...updates } : med)
      );
      toast.success("Medicamento atualizado com sucesso!");
    } catch (error: unknown) {
      console.error("Failed to update medication:", error);
      toast.error(`Erro ao atualizar medicamento: ${getErrorMessage(error)}`);
    }
  };

  const takeMedication = async (id: string) => {
    try {
      const medication = medications.find(m => m.id === id);
      if (!medication) return;

      const now = new Date().toISOString();
      const newQuantity = Math.max(0, medication.quantity - medication.dose_per_intake);
      
      const { error } = await supabase
        .from("patient_medications")
        .update({ 
          last_taken: now,
          quantity: newQuantity
        })
        .eq("id", id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(med => 
          med.id === id 
            ? { 
                ...med, 
                last_taken: now,
                quantity: newQuantity
              } 
            : med
        )
      );
      toast.success("Medicamento marcado como tomado!");
    } catch (error: unknown) {
      console.error("Failed to mark medication as taken:", error);
      toast.error(`Erro ao marcar medicamento: ${getErrorMessage(error)}`);
    }
  };

  const restockMedication = async (id: string, quantity: number, newExpiryDate?: Date, notes?: string) => {
    try {
      const medication = medications.find(m => m.id === id);
      if (!medication) return;

      const newTotalQuantity = medication.quantity + quantity;
      const updateData: { quantity: number; expiry_date?: string } = {
        quantity: newTotalQuantity,
      };

      if (newExpiryDate) {
        updateData.expiry_date = newExpiryDate.toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from("patient_medications")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Create restock entry
      const restockEntry: RestockEntry = {
        id: Date.now().toString(),
        medication_id: id,
        quantity_added: quantity,
        new_expiry_date: newExpiryDate ? newExpiryDate.toISOString().split('T')[0] : null,
        restock_date: new Date().toISOString(),
        notes
      };

      setMedications(prev =>
        prev.map(med => 
          med.id === id 
            ? { 
                ...med, 
                quantity: newTotalQuantity,
                expiry_date: newExpiryDate ? newExpiryDate.toISOString().split('T')[0] : med.expiry_date,
                restock_history: [...med.restock_history, restockEntry]
              } 
            : med
        )
      );
      toast.success("Medicamento reabastecido com sucesso!");
    } catch (error: unknown) {
      console.error("Failed to restock medication:", error);
      toast.error(`Erro ao reabastecer medicamento: ${getErrorMessage(error)}`);
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
    } catch (error: unknown) {
      console.error("Failed to add contact:", error);
      toast.error(`Erro ao adicionar contato: ${getErrorMessage(error)}`);
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
    } catch (error: unknown) {
      console.error("Failed to delete contact:", error);
      toast.error(`Erro ao remover contato: ${getErrorMessage(error)}`);
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
          date: entry.date
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newEntry: MoodEntryType = {
          ...data,
          mood: data.mood as MoodType,
          date: data.date
        };
        setMoodEntries(prev => [newEntry, ...prev]);
        toast.success("Entrada de humor registrada!");
      }
    } catch (error: unknown) {
      console.error("Failed to add mood entry:", error);
      toast.error(`Erro ao registrar humor: ${getErrorMessage(error)}`);
    }
  };

  const updatePatientProfile = async (updates: Partial<PatientProfileType>) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
        created_at: updates.created_at || undefined
      };

      const { data, error } = await supabase
        .from("patients")
        .update(updateData)
        .eq("id", selectedPatientId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPatientProfile({
          ...data,
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined
        });
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error: unknown) {
      console.error("Failed to update patient profile:", error);
      toast.error(`Erro ao atualizar perfil: ${getErrorMessage(error)}`);
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
    restockMedication,
    getNextDoseTime,
    getMedicationStatus,
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
