
import React from "react";
import { PillBottle, Clock, Check, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedication, MedicationType } from "@/context/MedicationContext";
import MedicationAlertSettings from "@/components/MedicationAlertSettings";

interface MedicationCardProps {
  medication: MedicationType;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  const { takeMedication } = useMedication();
  const { id, name, type, dosage, quantity, unit, times } = medication;

  // Próximo horário de tomar (simplificado para esta versão)
  const nextTime = times && times.length > 0 ? times[0] : "08:00";
  
  const isTakenToday = medication.last_taken
    ? new Date(medication.last_taken).toDateString() === new Date().toDateString()
    : false;

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <PillBottle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{name}</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              {type} - {dosage}
            </p>
            <div className="flex items-center mt-2 text-sm">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{nextTime}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              Restam: {quantity} {unit}
            </p>
            {quantity <= 5 && (
              <p className="text-xs text-destructive mt-1">Estoque baixo!</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <MedicationAlertSettings 
            medicationId={id} 
            medicationName={name}
            alertThreshold={medication.alert_threshold}
            autoAlertContactId={medication.auto_alert_contact_id}
          />
          
          <Button
            variant={isTakenToday ? "outline" : "default"}
            size="sm"
            className={`${isTakenToday ? "bg-muted" : ""}`}
            onClick={() => takeMedication(id)}
            disabled={isTakenToday || quantity <= 0}
          >
            {isTakenToday ? (
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-1" /> 
                <span className="hidden sm:inline">Tomado hoje</span>
                <span className="inline sm:hidden">Tomado</span>
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">Marcar como tomado</span>
                <span className="inline sm:hidden">Marcar</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
