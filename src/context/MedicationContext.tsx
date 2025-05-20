import React, { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export type MoodType = "happy" | "neutral" | "sad";

export interface Medication {
  id: string;
  name: string;
  type: string;
  dosage: string;
  quantity: number;
  unit: string;
  frequency: string;
  times: string[];
  notes?: string;
  lastTaken?: Date;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  relation: string;
}

export interface PatientProfile {
  fullName: string;
  age: string;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  recentDiagnosis: string[];
  doctors: {
    name: string;
    specialty: string;
    phone: string;
  }[];
  observations: string;
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Omit<Medication, "id">) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  takeMedication: (id: string) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  patientProfile: PatientProfile | null;
  updatePatientProfile: (profile: PatientProfile) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

// Default patient profile
const defaultPatientProfile: PatientProfile = {
  fullName: "",
  age: "",
  bloodType: "",
  allergies: [],
  chronicDiseases: [],
  recentDiagnosis: [],
  doctors: [],
  observations: "",
};

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(defaultPatientProfile);
  const { toast } = useToast();

  const addMedication = (medication: Omit<Medication, "id">) => {
    const newMedication = {
      ...medication,
      id: Date.now().toString(),
    };
    setMedications([...medications, newMedication]);
    toast({
      title: "Medicamento adicionado",
      description: `${medication.name} foi adicionado com sucesso.`,
    });
  };

  const updateMedication = (id: string, medication: Partial<Medication>) => {
    setMedications(
      medications.map((med) => (med.id === id ? { ...med, ...medication } : med))
    );
    toast({
      title: "Medicamento atualizado",
      description: "As informações foram atualizadas com sucesso.",
    });
  };

  const deleteMedication = (id: string) => {
    const medName = medications.find(med => med.id === id)?.name;
    setMedications(medications.filter((med) => med.id !== id));
    toast({
      title: "Medicamento removido",
      description: `${medName || "O medicamento"} foi removido com sucesso.`,
      variant: "destructive",
    });
  };

  const takeMedication = (id: string) => {
    const medication = medications.find((med) => med.id === id);
    if (!medication) return;
    
    const updatedMedication = {
      ...medication,
      lastTaken: new Date(),
      quantity: medication.quantity - 1 
    };
    
    setMedications(
      medications.map((med) => (med.id === id ? updatedMedication : med))
    );
    
    toast({
      title: "Medicamento tomado!",
      description: `${medication.name} foi registrado como tomado agora.`,
      variant: "default",
    });
    
    // Check if medication is running low (less than 5 units)
    if (updatedMedication.quantity <= 5) {
      toast({
        title: "Estoque baixo!",
        description: `${medication.name} está acabando. Restam apenas ${updatedMedication.quantity} ${updatedMedication.unit}.`,
        variant: "destructive",
      });
    }
  };

  const addMoodEntry = (entry: Omit<MoodEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setMoodEntries([...moodEntries, newEntry]);
    toast({
      title: "Humor registrado",
      description: "Seu humor foi registrado com sucesso.",
    });
  };

  const addContact = (contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, newContact]);
    toast({
      title: "Contato adicionado",
      description: `${contact.name} foi adicionado com sucesso.`,
    });
  };

  const updateContact = (id: string, contact: Partial<Contact>) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, ...contact } : c))
    );
    toast({
      title: "Contato atualizado",
      description: "As informações foram atualizadas com sucesso.",
    });
  };

  const deleteContact = (id: string) => {
    const contactName = contacts.find(c => c.id === id)?.name;
    setContacts(contacts.filter((c) => c.id !== id));
    toast({
      title: "Contato removido",
      description: `${contactName || "O contato"} foi removido com sucesso.`,
      variant: "destructive",
    });
  };

  const updatePatientProfile = (profile: PatientProfile) => {
    setPatientProfile(profile);
    toast({
      title: "Perfil atualizado",
      description: "Os dados do paciente foram atualizados com sucesso.",
    });
  };

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        updateMedication,
        deleteMedication,
        takeMedication,
        moodEntries,
        addMoodEntry,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        patientProfile,
        updatePatientProfile,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error("useMedication must be used within a MedicationProvider");
  }
  return context;
};
