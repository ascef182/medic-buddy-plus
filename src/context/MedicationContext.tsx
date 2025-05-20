import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export type MedicationType = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  type: string;
  notes: string | null;
  patient_id: string | null;
};

interface MedicationContextType {
  medications: MedicationType[];
  addMedication: (medication: Omit<MedicationType, "id" | "user_id" | "created_at">) => Promise<void>;
  fetchMedications: () => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Omit<MedicationType, "id" | "user_id" | "created_at">>) => Promise<void>;
  selectedPatientId: string | null;
  setSelectedPatientId: (patientId: string | null) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(
  undefined
);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    localStorage.getItem("selectedPatientId")
  );
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user, selectedPatientId]);

  useEffect(() => {
    localStorage.setItem("selectedPatientId", selectedPatientId || "");
  }, [selectedPatientId]);

  const fetchMedications = async () => {
    if (!user) return;

    let query = supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)

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
  };

  const addMedication = async (medicationData: Omit<MedicationType, "id" | "user_id" | "created_at">) => {
    if (!user) return;

    const medication = {
      ...medicationData,
      user_id: user.id,
    };

    try {
      const { error } = await supabase
        .from("medications")
        .insert([medication]);

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
        .from("medications")
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
        .from("medications")
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
