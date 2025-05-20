
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type MoodType = 
  | "happy" 
  | "neutral" 
  | "sad" 
  | "anxious"
  | "afraid"
  | "tense"
  | "nervous" 
  | "depressed";

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
  alert_threshold?: number;
  auto_alert_contact_id?: string;
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
      console.log("Loading data for patient:", patientId);
      
      // Load patient basic information first
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .eq("caregiver_id", user.id)
        .single();
        
      if (patientError) {
        console.error("Error loading patient:", patientError);
        throw patientError;
      }
      
      if (!patientData) {
        toast({
          title: "Erro ao carregar paciente",
          description: "Paciente não encontrado ou você não tem permissão para visualizá-lo",
          variant: "destructive",
        });
        return;
      }
      
      // Load patient medications
      try {
        const { data: medsData, error: medsError } = await supabase
          .from("patient_medications")
          .select("*")
          .eq("patient_id", patientId);

        if (medsError) {
          console.error("Error loading medications:", medsError);
        } else if (medsData) {
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
            lastTaken: med.last_taken ? new Date(med.last_taken) : undefined,
            alert_threshold: med.alert_threshold,
            auto_alert_contact_id: med.auto_alert_contact_id
          })));
        }
      } catch (err) {
        console.error("Failed to load medications:", err);
      }

      // Load mood entries
      try {
        const { data: moodData, error: moodError } = await supabase
          .from("patient_mood_entries")
          .select("*")
          .eq("patient_id", patientId)
          .order("date", { ascending: false });

        if (moodError) {
          console.error("Error loading mood entries:", moodError);
        } else if (moodData) {
          setMoodEntries(moodData.map(entry => ({
            id: entry.id,
            date: new Date(entry.date),
            mood: entry.mood as MoodType,
            notes: entry.notes
          })));
        }
      } catch (err) {
        console.error("Failed to load mood entries:", err);
      }

      // Load contacts
      try {
        const { data: contactsData, error: contactsError } = await supabase
          .from("patient_contacts")
          .select("*")
          .eq("patient_id", patientId);

        if (contactsError) {
          console.error("Error loading contacts:", contactsError);
        } else if (contactsData) {
          setContacts(contactsData.map(contact => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            relation: contact.relation
          })));
        }
      } catch (err) {
        console.error("Failed to load contacts:", err);
      }

      // Set up basic profile with patient data
      const profile: PatientProfile = {
        fullName: patientData.full_name,
        age: patientData.age || "",
        bloodType: patientData.blood_type || "",
        allergies: [],
        chronicDiseases: [],
        recentDiagnosis: [],
        doctors: [],
        observations: ""
      };

      // Try to load allergies
      try {
        const { data: allergiesData } = await supabase
          .from("patient_allergies")
          .select("allergy")
          .eq("patient_id", patientId);
          
        if (allergiesData) {
          profile.allergies = allergiesData.map(a => a.allergy);
        }
      } catch (err) {
        console.error("Failed to load allergies:", err);
      }

      // Try to load chronic diseases
      try {
        const { data: diseasesData } = await supabase
          .from("patient_chronic_diseases")
          .select("disease")
          .eq("patient_id", patientId);
          
        if (diseasesData) {
          profile.chronicDiseases = diseasesData.map(d => d.disease);
        }
      } catch (err) {
        console.error("Failed to load chronic diseases:", err);
      }

      // Try to load diagnoses
      try {
        const { data: diagnosesData } = await supabase
          .from("patient_diagnoses")
          .select("diagnosis")
          .eq("patient_id", patientId);
          
        if (diagnosesData) {
          profile.recentDiagnosis = diagnosesData.map(d => d.diagnosis);
        }
      } catch (err) {
        console.error("Failed to load diagnoses:", err);
      }

      // Try to load doctors
      try {
        const { data: doctorsData } = await supabase
          .from("patient_doctors")
          .select("name, specialty, phone")
          .eq("patient_id", patientId);
          
        if (doctorsData) {
          profile.doctors = doctorsData;
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }

      // Try to load observations
      try {
        const { data: obsData } = await supabase
          .from("patient_observations")
          .select("observations")
          .eq("patient_id", patientId)
          .maybeSingle();
          
        if (obsData) {
          profile.observations = obsData.observations || "";
        }
      } catch (err) {
        console.error("Failed to load observations:", err);
      }

      setPatientProfile(profile);
      
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
      console.log("Adding medication for patient:", pid, medication);
      
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

      if (error) {
        console.error("Error inserting medication:", error);
        throw error;
      }

      setMedications([...medications, {
        id: data.id,
        ...medication
      }]);
      
      toast({
        title: "Medicamento adicionado",
        description: `${medication.name} foi adicionado com sucesso.`,
      });
    } catch (error: any) {
      console.error("Failed to add medication:", error);
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
      console.log("Updating profile for patient:", selectedPatientId, profile);
      
      // Update basic patient info
      const { error: patientError } = await supabase
        .from("patients")
        .update({
          full_name: profile.fullName,
          age: profile.age,
          blood_type: profile.bloodType
        })
        .eq("id", selectedPatientId);

      if (patientError) {
        console.error("Error updating patient:", patientError);
        throw patientError;
      }

      // Handle allergies - delete existing and add new ones
      try {
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
      } catch (error) {
        console.error("Error updating allergies:", error);
      }

      // Handle chronic diseases - delete existing and add new ones
      try {
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
      } catch (error) {
        console.error("Error updating chronic diseases:", error);
      }

      // Handle diagnoses - delete existing and add new ones
      try {
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
      } catch (error) {
        console.error("Error updating diagnoses:", error);
      }

      // Handle doctors - delete existing and add new ones
      try {
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
      } catch (error) {
        console.error("Error updating doctors:", error);
      }

      // Update observations
      try {
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
      } catch (error) {
        console.error("Error updating observations:", error);
      }

      setPatientProfile(profile);
      
      toast({
        title: "Perfil atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
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

export const useMedication = (): MedicationContextType => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error("useMedication must be used within a MedicationProvider");
  }
  return context;
};
