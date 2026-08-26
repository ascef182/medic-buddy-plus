
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMedication, MoodType } from "@/context/MedicationContext";

const MoodTracker: React.FC = () => {
  const { addMoodEntry } = useMedication();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodEntry({
        date: new Date().toISOString(),
        mood: selectedMood,
        notes,
      });
      
      // Reset form
      setSelectedMood(null);
      setNotes("");
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Como você está se sentindo?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              type="button"
              variant={selectedMood === mood.value ? "default" : "outline-solid"}
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
          placeholder="Adicione notas sobre como está se sentindo (opcional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className="w-full"
        >
          Registrar humor
        </Button>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
