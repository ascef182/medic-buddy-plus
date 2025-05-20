
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  addMedication: (medication: Omit<Medication, "id">, patientId?: string) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  takeMedication: (id: string) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">, patientId?: string) => void;
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">, patientId?: string) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  patientProfile: PatientProfile | null;
  updatePatientProfile: (profile: PatientProfile) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  loadPatientData: (patientId: string) => Promise<void>;
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
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    localStorage.getItem("selectedPatientId")
  );
  const { toast } = useToast();
  const { user } = useAuth();

  // Load patient data whenever selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId && user) {
      loadPatientData(selectedPatientId);
    }
  }, [selectedPatientId, user]);

  const loadPatientData = async (patientId: string) => {
    if (!user) return;

    try {
      // Load medications for the selected patient
      const { data: medsData, error: medsError } = await supabase
        .from("patient_medications")
        .select("*")
        .eq("patient_id", patientId);

      if (medsError) throw medsError;
      
      if (medsData) {
        setMedications(medsData.map(med => ({
          id: med.id,
          name: med.name,
          type: med.type,
          dosage: med.dosage,
          quantity: med.quantity,
          unit: med.unit,
          frequency: med.frequency,
          times: med.times,
          notes: med.notes,
          lastTaken: med.last_taken ? new Date(med.last_taken) : undefined
        })));
      }

      // Load mood entries
      const { data: moodData, error: moodError } = await supabase
        .from("patient_mood_entries")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: false });

      if (moodError) throw moodError;
      
      if (moodData) {
        setMoodEntries(moodData.map(entry => ({
          id: entry.id,
          date: new Date(entry.date),
          mood: entry.mood as MoodType,
          notes: entry.notes
        })));
      }

      // Load contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from("patient_contacts")
        .select("*")
        .eq("patient_id", patientId);

      if (contactsError) throw contactsError;
      
      if (contactsData) {
        setContacts(contactsData.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          relation: contact.relation
        })));
      }

      // Load patient profile data
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (patientError) throw patientError;

      // Load allergies
      const { data: allergiesData, error: allergiesError } = await supabase
        .from("patient_allergies")
        .select("allergy")
        .eq("patient_id", patientId);

      if (allergiesError) throw allergiesError;

      // Load chronic diseases
      const { data: diseasesData, error: diseasesError } = await supabase
        .from("patient_chronic_diseases")
        .select("disease")
        .eq("patient_id", patientId);

      if (diseasesError) throw diseasesError;

      // Load diagnoses
      const { data: diagnosesData, error: diagnosesError } = await supabase
        .from("patient_diagnoses")
        .select("diagnosis")
        .eq("patient_id", patientId);

      if (diagnosesError) throw diagnosesError;

      // Load doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("patient_doctors")
        .select("name, specialty, phone")
        .eq("patient_id", patientId);

      if (doctorsError) throw doctorsError;

      // Load observations
      const { data: obsData, error: obsError } = await supabase
        .from("patient_observations")
        .select("observations")
        .eq("patient_id", patientId)
        .maybeSingle();

      if (obsError) throw obsError;

      // Set patient profile
      setPatientProfile({
        fullName: patientData.full_name,
        age: patientData.age,
        bloodType: patientData.blood_type || "",
        allergies: allergiesData?.map(a => a.allergy) || [],
        chronicDiseases: diseasesData?.map(d => d.disease) || [],
        recentDiagnosis: diagnosesData?.map(d => d.diagnosis) || [],
        doctors: doctorsData || [],
        observations: obsData?.observations || ""
      });

    } catch (error: any) {
      console.error("Error loading patient data:", error);
      toast({
        title: "Erro ao carregar dados do paciente",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add medication to the database
  const addMedication = async (medication: Omit<Medication, "id">, patientId?: string) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast({
        title: "Erro",
        description: "Nenhum paciente selecionado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_medications")
        .insert({
          patient_id: pid,
          name: medication.name,
          type: medication.type,
          dosage: medication.dosage,
          quantity: medication.quantity,
          unit: medication.unit,
          frequency: medication.frequency,
          times: medication.times,
          notes: medication.notes
        })
        .select()
        .single();

      if (error) throw error;

      setMedications([...medications, {
        id: data.id,
        ...medication
      }]);
      
      toast({
        title: "Medicamento adicionado",
        description: `${medication.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar medicamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update medication in the database
  const updateMedication = async (id: string, medication: Partial<Medication>) => {
    if (!selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patient_medications")
        .update({
          name: medication.name,
          type: medication.type,
          dosage: medication.dosage,
          quantity: medication.quantity,
          unit: medication.unit,
          frequency: medication.frequency,
          times: medication.times,
          notes: medication.notes
        })
        .eq("id", id)
        .eq("patient_id", selectedPatientId);

      if (error) throw error;

      setMedications(
        medications.map((med) => (med.id === id ? { ...med, ...medication } : med))
      );
      
      toast({
        title: "Medicamento atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar medicamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete medication from the database
  const deleteMedication = async (id: string) => {
    if (!selectedPatientId) return;

    try {
      const medName = medications.find(med => med.id === id)?.name;
      
      const { error } = await supabase
        .from("patient_medications")
        .delete()
        .eq("id", id)
        .eq("patient_id", selectedPatientId);

      if (error) throw error;

      setMedications(medications.filter((med) => med.id !== id));
      
      toast({
        title: "Medicamento removido",
        description: `${medName || "O medicamento"} foi removido com sucesso.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover medicamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Mark medication as taken in the database
  const takeMedication = async (id: string) => {
    if (!selectedPatientId) return;
    
    const medication = medications.find((med) => med.id === id);
    if (!medication) return;
    
    const now = new Date();
    const updatedQuantity = medication.quantity - 1;
    
    try {
      const { error } = await supabase
        .from("patient_medications")
        .update({
          quantity: updatedQuantity,
          last_taken: now.toISOString()
        })
        .eq("id", id)
        .eq("patient_id", selectedPatientId);

      if (error) throw error;

      setMedications(
        medications.map((med) => 
          med.id === id 
            ? { ...med, quantity: updatedQuantity, lastTaken: now } 
            : med
        )
      );
      
      toast({
        title: "Medicamento tomado!",
        description: `${medication.name} foi registrado como tomado agora.`,
      });
      
      // Check if medication is running low (less than 5 units)
      if (updatedQuantity <= 5) {
        toast({
          title: "Estoque baixo!",
          description: `${medication.name} está acabando. Restam apenas ${updatedQuantity} ${medication.unit}.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao registrar medicamento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add mood entry to the database
  const addMoodEntry = async (entry: Omit<MoodEntry, "id">, patientId?: string) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast({
        title: "Erro",
        description: "Nenhum paciente selecionado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_mood_entries")
        .insert({
          patient_id: pid,
          date: entry.date.toISOString(),
          mood: entry.mood,
          notes: entry.notes
        })
        .select()
        .single();

      if (error) throw error;

      setMoodEntries([
        {
          id: data.id,
          ...entry
        },
        ...moodEntries
      ]);
      
      toast({
        title: "Humor registrado",
        description: "Seu humor foi registrado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao registrar humor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add contact to the database
  const addContact = async (contact: Omit<Contact, "id">, patientId?: string) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast({
        title: "Erro",
        description: "Nenhum paciente selecionado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_contacts")
        .insert({
          patient_id: pid,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          relation: contact.relation
        })
        .select()
        .single();

      if (error) throw error;

      setContacts([...contacts, {
        id: data.id,
        ...contact
      }]);
      
      toast({
        title: "Contato adicionado",
        description: `${contact.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar contato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update contact in the database
  const updateContact = async (id: string, contact: Partial<Contact>) => {
    if (!selectedPatientId) return;

    try {
      const { error } = await supabase
        .from("patient_contacts")
        .update({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          relation: contact.relation
        })
        .eq("id", id)
        .eq("patient_id", selectedPatientId);

      if (error) throw error;

      setContacts(
        contacts.map((c) => (c.id === id ? { ...c, ...contact } : c))
      );
      
      toast({
        title: "Contato atualizado",
        description: "As informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar contato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete contact from the database
  const deleteContact = async (id: string) => {
    if (!selectedPatientId) return;

    try {
      const contactName = contacts.find(c => c.id === id)?.name;
      
      const { error } = await supabase
        .from("patient_contacts")
        .delete()
        .eq("id", id)
        .eq("patient_id", selectedPatientId);

      if (error) throw error;

      setContacts(contacts.filter((c) => c.id !== id));
      
      toast({
        title: "Contato removido",
        description: `${contactName || "O contato"} foi removido com sucesso.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover contato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update patient profile in the database
  const updatePatientProfile = async (profile: PatientProfile) => {
    if (!selectedPatientId) return;

    try {
      // Update basic patient info
      const { error: patientError } = await supabase
        .from("patients")
        .update({
          full_name: profile.fullName,
          age: profile.age,
          blood_type: profile.bloodType
        })
        .eq("id", selectedPatientId);

      if (patientError) throw patientError;

      // Delete existing allergies and insert new ones
      await supabase
        .from("patient_allergies")
        .delete()
        .eq("patient_id", selectedPatientId);
      
      if (profile.allergies.length > 0) {
        await supabase
          .from("patient_allergies")
          .insert(
            profile.allergies.map(allergy => ({
              patient_id: selectedPatientId,
              allergy
            }))
          );
      }

      // Delete existing chronic diseases and insert new ones
      await supabase
        .from("patient_chronic_diseases")
        .delete()
        .eq("patient_id", selectedPatientId);
      
      if (profile.chronicDiseases.length > 0) {
        await supabase
          .from("patient_chronic_diseases")
          .insert(
            profile.chronicDiseases.map(disease => ({
              patient_id: selectedPatientId,
              disease
            }))
          );
      }

      // Delete existing diagnoses and insert new ones
      await supabase
        .from("patient_diagnoses")
        .delete()
        .eq("patient_id", selectedPatientId);
      
      if (profile.recentDiagnosis.length > 0) {
        await supabase
          .from("patient_diagnoses")
          .insert(
            profile.recentDiagnosis.map(diagnosis => ({
              patient_id: selectedPatientId,
              diagnosis
            }))
          );
      }

      // Delete existing doctors and insert new ones
      await supabase
        .from("patient_doctors")
        .delete()
        .eq("patient_id", selectedPatientId);
      
      if (profile.doctors.length > 0) {
        await supabase
          .from("patient_doctors")
          .insert(
            profile.doctors.map(doctor => ({
              patient_id: selectedPatientId,
              name: doctor.name,
              specialty: doctor.specialty,
              phone: doctor.phone
            }))
          );
      }

      // Update observations
      const { data: existingObs } = await supabase
        .from("patient_observations")
        .select("id")
        .eq("patient_id", selectedPatientId)
        .maybeSingle();

      if (existingObs) {
        await supabase
          .from("patient_observations")
          .update({ observations: profile.observations })
          .eq("id", existingObs.id);
      } else {
        await supabase
          .from("patient_observations")
          .insert({
            patient_id: selectedPatientId,
            observations: profile.observations
          });
      }

      setPatientProfile(profile);
      
      toast({
        title: "Perfil atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
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
        selectedPatientId,
        setSelectedPatientId,
        loadPatientData
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
