
import React, { useState } from "react";
import { PillBottle, Clock, Check, Bell, Plus, Calendar, Brush } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMedication, MedicationType } from "@/context/MedicationContext";
import MedicationAlertSettings from "@/components/MedicationAlertSettings";
import MedicationClock from "@/components/MedicationClock";
import MedicationStatus from "@/components/MedicationStatus";
import RestockMedicationDialog from "@/components/RestockMedicationDialog";

interface MedicationCardProps {
  medication: MedicationType;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  const { takeMedication, getNextDoseTime, getMedicationStatus } = useMedication();
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  
  const { id, name, type, dosage, quantity, unit, times, dose_per_intake } = medication;

  const nextDoseTime = getNextDoseTime(medication);
  const status = getMedicationStatus(medication);
  
  const isTakenToday = medication.last_taken
    ? new Date(medication.last_taken).toDateString() === new Date().toDateString()
    : false;

  const daysOfStockLeft = Math.floor(quantity / dose_per_intake);

  return (
    <>
      <Card className="overflow-hidden border-l-4 border-l-primary mb-3">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <PillBottle className="h-4 w-4 text-primary flex-shrink-0" />
                  <h3 className="text-sm font-medium truncate">{name}</h3>
                </div>
                <p className="text-muted-foreground text-xs truncate">
                  {type} - {dosage}
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{medication.frequency}</span>
                </div>
              </div>
              
              <div className="text-right space-y-1 ml-2 flex-shrink-0">
                <p className="text-xs font-medium">
                  {quantity} {unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daysOfStockLeft}d
                </p>
                {medication.expiry_date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(medication.expiry_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <MedicationStatus medication={medication} status={status} />

            {/* Clock */}
            <MedicationClock medication={medication} nextDoseTime={nextDoseTime} />

            {/* Times display */}
            {times.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground">Horários:</span>
                {times.slice(0, 3).map((time, index) => (
                  <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                    {time}
                  </span>
                ))}
                {times.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{times.length - 3}</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-1 justify-between items-center">
              <div className="flex gap-1">
                <MedicationAlertSettings 
                  medicationId={id} 
                  medicationName={name}
                  alertThreshold={medication.alert_threshold}
                  autoAlertContactId={medication.auto_alert_contact_id}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRestockDialog(true)}
                  className="px-2 h-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 h-8"
                >
                  <Brush className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant={isTakenToday ? "outline" : "default"}
                size="sm"
                className={`text-xs px-2 h-8 ${isTakenToday ? "bg-muted" : ""} ${
                  status === 'overdue' ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
                onClick={() => takeMedication(id)}
                disabled={isTakenToday || quantity <= 0 || status === 'expired'}
              >
                {isTakenToday ? (
                  <span className="flex items-center">
                    <Check className="h-3 w-3 mr-1" /> 
                    <span className="hidden sm:inline">Tomado</span>
                  </span>
                ) : (
                  <span className="hidden sm:inline">Marcar</span>
                )}
              </Button>
            </div>

            {/* Additional info */}
            {medication.notes && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Obs:</strong> {medication.notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RestockMedicationDialog
        medication={medication}
        open={showRestockDialog}
        onOpenChange={setShowRestockDialog}
      />
    </>
  );
};

export default MedicationCard;
