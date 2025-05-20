
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMedication } from "@/context/MedicationContext";

const MoodTracker: React.FC = () => {
  const { addMoodEntry } = useMedication();
  const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad" | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodEntry({
        date: new Date(),
        mood: selectedMood,
        notes,
      });
      
      // Reset form
      setSelectedMood(null);
      setNotes("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Como você está se sentindo?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4 mb-4">
          <Button
            type="button"
            variant={selectedMood === "happy" ? "default" : "outline"}
            className={`h-16 w-16 text-2xl ${
              selectedMood === "happy" ? "bg-secondary text-white" : ""
            }`}
            onClick={() => setSelectedMood("happy")}
          >
            😊
          </Button>
          <Button
            type="button"
            variant={selectedMood === "neutral" ? "default" : "outline"}
            className={`h-16 w-16 text-2xl ${
              selectedMood === "neutral" ? "bg-primary text-white" : ""
            }`}
            onClick={() => setSelectedMood("neutral")}
          >
            😐
          </Button>
          <Button
            type="button"
            variant={selectedMood === "sad" ? "default" : "outline"}
            className={`h-16 w-16 text-2xl ${
              selectedMood === "sad" ? "bg-destructive text-white" : ""
            }`}
            onClick={() => setSelectedMood("sad")}
          >
            😔
          </Button>
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
