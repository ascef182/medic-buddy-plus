
import { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import MoodTracker from "@/components/MoodTracker";
import { Card, CardContent } from "@/components/ui/card";
import { useMedication } from "@/context/MedicationContext";

const MoodPage = () => {
  const { moodEntries } = useMedication();
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Acompanhamento de Humor</h1>
        <p className="text-muted-foreground">
          Acompanhe como você tem se sentido
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <MoodTracker />
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-medium mb-4">Histórico de Humor</h2>
          
          {moodEntries.length > 0 ? (
            <div className="space-y-4">
              {[...moodEntries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                <Card key={entry.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-2xl mr-3">
                            {getMoodEmoji(entry.mood)}
                          </span>
                          {entry.notes && (
                            <p className="text-sm">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">
                Nenhum registro de humor ainda. Registre como você está se sentindo hoje!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MoodPage;
