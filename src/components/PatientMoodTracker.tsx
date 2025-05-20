
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { MoodType } from "@/context/MedicationContext";

interface PatientMoodTrackerProps {
  patientId: string;
}

const PatientMoodTracker: React.FC<PatientMoodTrackerProps> = ({ patientId }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions: { value: MoodType; label: string; emoji: string }[] = [
    { value: "happy", label: "Feliz", emoji: "😊" },
    { value: "neutral", label: "Neutro", emoji: "😐" },
    { value: "sad", label: "Triste", emoji: "😔" },
    { value: "anxious", label: "Ansioso", emoji: "😰" },
    { value: "afraid", label: "Medo", emoji: "😨" },
    { value: "tense", label: "Tenso", emoji: "😖" },
    { value: "nervous", label: "Nervoso", emoji: "😤" },
    { value: "depressed", label: "Deprimido", emoji: "😞" },
  ];

  const handleSubmit = async () => {
    if (!selectedMood || !patientId) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("patient_mood_entries")
        .insert({
          patient_id: patientId,
          mood: selectedMood,
          notes: notes,
          date: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success("Seu humor foi registrado com sucesso!");
      setSelectedMood(null);
      setNotes("");
    } catch (error: any) {
      toast.error(`Erro ao registrar humor: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-2">Como você está se sentindo hoje?</p>
      
      <div className="grid grid-cols-4 gap-2">
        {moodOptions.map((mood) => (
          <Button
            key={mood.value}
            type="button"
            variant={selectedMood === mood.value ? "default" : "outline"}
            className={`h-16 flex flex-col items-center justify-center p-1 ${
              selectedMood === mood.value ? 
                mood.value === "happy" ? "bg-green-500" :
                mood.value === "neutral" ? "bg-blue-500" :
                mood.value === "sad" ? "bg-rose-500" :
                mood.value === "anxious" ? "bg-amber-500" :
                mood.value === "afraid" ? "bg-orange-500" :
                mood.value === "tense" ? "bg-purple-500" :
                mood.value === "nervous" ? "bg-red-500" :
                "bg-slate-500" : ""
            }`}
            onClick={() => setSelectedMood(mood.value)}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-xs mt-1">{mood.label}</span>
          </Button>
        ))}
      </div>

      <Textarea
        placeholder="Descreva como você está se sentindo (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={!selectedMood || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Registrando..." : "Registrar humor"}
      </Button>
    </div>
  );
};

export default PatientMoodTracker;
