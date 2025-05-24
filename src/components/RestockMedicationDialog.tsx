
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MedicationType, useMedication } from "@/context/MedicationContext";

interface RestockMedicationDialogProps {
  medication: MedicationType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RestockMedicationDialog: React.FC<RestockMedicationDialogProps> = ({
  medication,
  open,
  onOpenChange,
}) => {
  const { restockMedication } = useMedication();
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");

  const handleRestock = async () => {
    if (!quantity || isNaN(Number(quantity))) {
      return;
    }

    await restockMedication(
      medication.id,
      Number(quantity),
      expiryDate,
      notes
    );

    // Reset form
    setQuantity("");
    setExpiryDate(undefined);
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reabastecer Medicamento</DialogTitle>
          <DialogDescription>
            Registre a compra de novo estoque para <strong>{medication.name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current-stock">Estoque atual</Label>
            <Input
              id="current-stock"
              value={`${medication.quantity} ${medication.unit}`}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantidade a adicionar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Ex: 30 ${medication.unit}`}
            />
          </div>

          <div className="grid gap-2">
            <Label>Nova data de validade (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Comprado na farmácia XYZ, lote ABC123"
              rows={3}
            />
          </div>

          {quantity && !isNaN(Number(quantity)) && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Novo estoque:</strong> {medication.quantity + Number(quantity)} {medication.unit}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRestock}
            disabled={!quantity || isNaN(Number(quantity))}
          >
            Confirmar Reabastecimento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestockMedicationDialog;
