
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { MedicationType } from "@/context/MedicationContext";

interface MedicationClockProps {
  medication: MedicationType;
  nextDoseTime: Date | null;
}

const MedicationClock: React.FC<MedicationClockProps> = ({ medication, nextDoseTime }) => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    const updateTimeUntilNext = () => {
      if (!nextDoseTime) {
        setTimeUntilNext("Horário não definido");
        return;
      }

      const now = new Date();
      const diff = nextDoseTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeUntilNext("Hora de tomar!");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeUntilNext(`${hours}h ${minutes.toString().padStart(2, '0')}min`);
      } else {
        setTimeUntilNext(`${minutes}min`);
      }
    };

    updateTimeUntilNext();
    const interval = setInterval(updateTimeUntilNext, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextDoseTime]);

  const isOverdue = nextDoseTime && nextDoseTime < new Date();

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border-2 ${
      isOverdue 
        ? "border-red-200 bg-red-50 text-red-700" 
        : "border-blue-200 bg-blue-50 text-blue-700"
    }`}>
      <Clock className={`h-5 w-5 ${isOverdue ? "animate-pulse" : ""}`} />
      <div className="text-sm">
        <div className="font-medium">
          {isOverdue ? "ATRASADO!" : "Próxima dose"}
        </div>
        <div className={`${isOverdue ? "font-bold" : ""}`}>
          {timeUntilNext}
        </div>
      </div>
    </div>
  );
};

export default MedicationClock;
