
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Medication {
  id: string;
  name: string;
  quantity: number;
  last_taken?: string;
  [key: string]: any;
}

interface MedicationTakeButtonProps {
  medication: Medication;
  patientId: string;
}

const MedicationTakeButton: React.FC<MedicationTakeButtonProps> = ({ medication, patientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const isTakenToday = medication.last_taken
    ? new Date(medication.last_taken).toDateString() === new Date().toDateString()
    : false;
    
  const handleTakeMedication = async () => {
    if (!patientId || !medication.id) return;
    
    setIsLoading(true);
    const now = new Date();
    const updatedQuantity = medication.quantity - 1;
    
    try {
      const { error } = await supabase
        .from("patient_medications")
        .update({
          quantity: updatedQuantity,
          last_taken: now.toISOString()
        })
        .eq("id", medication.id)
        .eq("patient_id", patientId);

      if (error) throw error;
      
      toast.success(`${medication.name} foi registrado como tomado agora.`);
      
      // Update local state to reflect changes
      medication.quantity = updatedQuantity;
      medication.last_taken = now.toISOString();
      
    } catch (error: any) {
      toast.error(`Erro ao registrar medicamento: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant={isTakenToday ? "outline" : "default"}
      size="sm"
      className={`${isTakenToday ? "bg-muted" : ""}`}
      onClick={handleTakeMedication}
      disabled={isLoading || isTakenToday || medication.quantity <= 0}
    >
      {isTakenToday ? (
        <span className="flex items-center">
          <Check className="h-4 w-4 mr-1" /> Tomado
        </span>
      ) : (
        "Tomar agora"
      )}
    </Button>
  );
};

export default MedicationTakeButton;
