
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMedication } from "@/context/MedicationContext";

const AddMedicationForm: React.FC = () => {
  const { addMedication } = useMedication();
  
  // Basic info
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("comprimidos");
  const [frequency, setFrequency] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [notes, setNotes] = useState("");

  // Enhanced fields
  const [dosePerIntake, setDosePerIntake] = useState("1");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isRecurring, setIsRecurring] = useState(false);
  const [stockAlertThreshold, setStockAlertThreshold] = useState("5");

  const handleAddTime = () => {
    setTimes([...times, ""]);
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = [...times];
    newTimes.splice(index, 1);
    setTimes(newTimes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMedication({
      name,
      type,
      dosage,
      quantity: Number(quantity),
      unit,
      frequency,
      times: times.filter((t) => t),
      notes,
      dose_per_intake: Number(dosePerIntake),
      start_date: startDate,
      end_date: endDate,
      expiry_date: expiryDate,
      is_recurring: isRecurring,
      stock_alert_threshold: Number(stockAlertThreshold),
    });

    // Reset form
    setName("");
    setType("");
    setDosage("");
    setQuantity("");
    setUnit("comprimidos");
    setFrequency("");
    setTimes(["08:00"]);
    setNotes("");
    setDosePerIntake("1");
    setStartDate(new Date());
    setEndDate(undefined);
    setExpiryDate(undefined);
    setIsRecurring(false);
    setStockAlertThreshold("5");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações Básicas</h3>
        
        <div>
          <Label htmlFor="name">Nome do Medicamento</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: Paracetamol"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="type" className="mt-1">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Comprimido">Comprimido</SelectItem>
                <SelectItem value="Cápsula">Cápsula</SelectItem>
                <SelectItem value="Líquido">Líquido</SelectItem>
                <SelectItem value="Injetável">Injetável</SelectItem>
                <SelectItem value="Pomada">Pomada</SelectItem>
                <SelectItem value="Gotas">Gotas</SelectItem>
                <SelectItem value="Spray">Spray</SelectItem>
                <SelectItem value="Adesivo">Adesivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dosage">Concentração/Dosagem</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              placeholder="Ex: 500mg, 10ml"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informações de Estoque</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quantity">Quantidade Atual</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              type="number"
              min="0"
              placeholder="Ex: 30"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="unit">Unidade</Label>
            <Select value={unit} onValueChange={setUnit} required>
              <SelectTrigger id="unit" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprimidos">Comprimidos</SelectItem>
                <SelectItem value="cápsulas">Cápsulas</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="ampolas">Ampolas</SelectItem>
                <SelectItem value="doses">Doses</SelectItem>
                <SelectItem value="gramas">Gramas</SelectItem>
                <SelectItem value="unidades">Unidades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dose-per-intake">Dose por Tomada</Label>
            <Input
              id="dose-per-intake"
              value={dosePerIntake}
              onChange={(e) => setDosePerIntake(e.target.value)}
              required
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Ex: 1"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="stock-alert">Alerta de Estoque Baixo (dias)</Label>
          <Input
            id="stock-alert"
            value={stockAlertThreshold}
            onChange={(e) => setStockAlertThreshold(e.target.value)}
            type="number"
            min="1"
            placeholder="Ex: 5"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Alertar quando restarem poucos dias de medicamento
          </p>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Horários e Frequência</h3>
        
        <div>
          <Label htmlFor="frequency">Frequência</Label>
          <Select value={frequency} onValueChange={setFrequency} required>
            <SelectTrigger id="frequency" className="mt-1">
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1x ao dia">1x ao dia</SelectItem>
              <SelectItem value="2x ao dia">2x ao dia</SelectItem>
              <SelectItem value="3x ao dia">3x ao dia</SelectItem>
              <SelectItem value="4x ao dia">4x ao dia</SelectItem>
              <SelectItem value="A cada 6 horas">A cada 6 horas</SelectItem>
              <SelectItem value="A cada 8 horas">A cada 8 horas</SelectItem>
              <SelectItem value="A cada 12 horas">A cada 12 horas</SelectItem>
              <SelectItem value="Semanal">Semanal</SelectItem>
              <SelectItem value="Conforme necessário">Conforme necessário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Horários</Label>
          <div className="space-y-2 mt-1">
            {times.map((time, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="flex-1"
                />
                {times.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTime(index)}
                  >
                    Remover
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTime}
              className="w-full mt-2"
            >
              Adicionar Horário
            </Button>
          </div>
        </div>
      </div>

      {/* Treatment Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Datas do Tratamento</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Data de Término (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label>Data de Validade (opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="recurring"
            checked={isRecurring}
            onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
          />
          <Label htmlFor="recurring" className="text-sm">
            Medicamento de uso contínuo (recorrente)
          </Label>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações adicionais (opcional)"
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Adicionar Medicamento
      </Button>
    </form>
  );
};

export default AddMedicationForm;
