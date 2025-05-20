
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMedication } from "@/context/MedicationContext";

const Reminders = () => {
  const { medications, takeMedication } = useMedication();
  
  // Generate reminders based on medications and their times
  const generateReminders = () => {
    const reminders = [];
    const now = new Date();
    
    for (const med of medications) {
      for (const time of med.times) {
        const [hours, minutes] = time.split(":");
        const reminderDate = new Date();
        reminderDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        // Check if the medication was already taken today
        const isTakenToday = med.lastTaken 
          ? new Date(med.lastTaken).toDateString() === now.toDateString()
          : false;
        
        // Add reminder if it's in the future for today or if it's past and not taken
        if ((reminderDate > now) || (reminderDate < now && !isTakenToday)) {
          reminders.push({
            id: `${med.id}-${time}`,
            medicationId: med.id,
            medicationName: med.name,
            time: reminderDate,
            timeString: time,
            isUpcoming: reminderDate > now,
            isTaken: isTakenToday,
            dosage: med.dosage
          });
        }
      }
    }
    
    // Sort by time
    reminders.sort((a, b) => a.time.getTime() - b.time.getTime());
    return reminders;
  };
  
  const [reminders, setReminders] = useState(generateReminders());
  
  // Update reminders when medications change
  useEffect(() => {
    setReminders(generateReminders());
  }, [medications]);
  
  const handleTakeMedication = (medicationId: string) => {
    takeMedication(medicationId);
    setReminders(generateReminders());
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lembretes</h1>
      </div>
      
      <div className="space-y-4">
        {reminders.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Hoje</h2>
            
            {reminders.map((reminder) => (
              <Card key={reminder.id} className={`border-l-4 ${
                reminder.isTaken 
                  ? "border-l-muted bg-muted/10" 
                  : reminder.isUpcoming 
                    ? "border-l-primary" 
                    : "border-l-destructive"
              }`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bell className={`h-5 w-5 mr-3 ${
                        reminder.isTaken 
                          ? "text-muted-foreground" 
                          : reminder.isUpcoming 
                            ? "text-primary" 
                            : "text-destructive"
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          reminder.isTaken ? "text-muted-foreground" : ""
                        }`}>
                          {reminder.medicationName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reminder.dosage} às {reminder.timeString}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      {reminder.isTaken ? (
                        <span className="flex items-center text-muted-foreground text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          Tomado
                        </span>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleTakeMedication(reminder.medicationId)}
                        >
                          Marcar como tomado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhum lembrete para hoje
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reminders;
