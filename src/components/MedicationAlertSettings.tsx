
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { useMedication } from "@/context/MedicationContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MedicationAlertSettingsProps {
  medicationId: string;
  medicationName: string;
  alertThreshold?: number;
  autoAlertContactId?: string | null;
}

const MedicationAlertSettings: React.FC<MedicationAlertSettingsProps> = ({ 
  medicationId, 
  medicationName,
  alertThreshold = 60,
  autoAlertContactId = undefined
}) => {
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(alertThreshold);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(autoAlertContactId);
  const { contacts, updateMedication } = useMedication();

  const saveSettings = async () => {
    try {
      await updateMedication(medicationId, {
        alert_threshold: threshold,
        auto_alert_contact_id: selectedContactId || null
      });
      
      toast.success("Configurações de alerta salvas com sucesso!");
      setOpen(false);
    } catch (error: any) {
      toast.error(`Erro ao salvar configurações: ${error.message}`);
      console.error("Error saving alert settings:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Configurar Alertas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Alertas de Medicação</DialogTitle>
          <DialogDescription>
            Configure alertas automáticos para {medicationName} quando não for tomado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">Tempo de espera (minutos)</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              min={1}
              max={1440}
            />
            <p className="text-xs text-muted-foreground">
              Tempo após o horário programado para enviar alerta se o medicamento não for tomado.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contato a ser notificado</Label>
            <Select 
              value={selectedContactId} 
              onValueChange={(value) => setSelectedContactId(value)}
            >
              <SelectTrigger id="contact">
                <SelectValue placeholder="Selecione um contato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} ({contact.relation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selecione um contato para receber alertas automáticos.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={saveSettings}>Salvar Configurações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAlertSettings;
