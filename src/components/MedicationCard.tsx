
import React, { useState } from "react";
import { PillBottle, Clock, Check, Bell, Plus, Calendar } from "lucide-react";
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
      <Card className="overflow-hidden border-l-4 border-l-primary mb-4">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <PillBottle className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">{name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {type} - {dosage}
                </p>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{medication.frequency}</span>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">
                  Estoque: {quantity} {unit}
                </p>
                <p className="text-xs text-muted-foreground">
                  {daysOfStockLeft} dias restantes
                </p>
                {medication.expiry_date && (
                  <p className="text-xs text-muted-foreground">
                    Vence: {new Date(medication.expiry_date).toLocaleDateString()}
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
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Horários:</span>
                {times.map((time, index) => (
                  <span key={index} className="text-sm bg-muted px-2 py-1 rounded">
                    {time}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-between">
              <div className="flex gap-2">
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
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Reabastecer</span>
                </Button>
              </div>
              
              <Button
                variant={isTakenToday ? "outline" : "default"}
                size="sm"
                className={`${isTakenToday ? "bg-muted" : ""} ${
                  status === 'overdue' ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
                onClick={() => takeMedication(id)}
                disabled={isTakenToday || quantity <= 0 || status === 'expired'}
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

            {/* Additional info */}
            {medication.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Observações:</strong> {medication.notes}
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
