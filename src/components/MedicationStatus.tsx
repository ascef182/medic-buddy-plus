
import React from "react";
import { AlertTriangle, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { MedicationType } from "@/context/MedicationContext";

interface MedicationStatusProps {
  medication: MedicationType;
  status: 'on_time' | 'low_stock' | 'expiring_soon' | 'overdue' | 'expired';
}

const MedicationStatus: React.FC<MedicationStatusProps> = ({ medication, status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'expired':
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          label: "VENCIDO",
          description: "Medicamento vencido - não utilize!"
        };
      case 'overdue':
        return {
          icon: Clock,
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
          label: "ATRASADO",
          description: "Dose em atraso"
        };
      case 'expiring_soon':
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
          label: "VENCE EM BREVE",
          description: "Medicamento vence nos próximos 7 dias"
        };
      case 'low_stock':
        return {
          icon: AlertCircle,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-300",
          label: "ESTOQUE BAIXO",
          description: `Restam apenas ${medication.quantity} ${medication.unit}`
        };
      case 'on_time':
      default:
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
          label: "EM DIA",
          description: "Medicamento em dia"
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (!medication.expiry_date) return null;
    const days = Math.ceil((medication.expiry_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${config.borderColor} ${config.bgColor}`}>
      <StatusIcon className={`h-4 w-4 ${config.color}`} />
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold ${config.color}`}>
          {config.label}
        </div>
        <div className={`text-xs ${config.color} opacity-80`}>
          {config.description}
        </div>
        {daysUntilExpiry !== null && daysUntilExpiry > 0 && status === 'expiring_soon' && (
          <div className={`text-xs ${config.color} font-medium`}>
            Vence em {daysUntilExpiry} dia{daysUntilExpiry > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationStatus;
