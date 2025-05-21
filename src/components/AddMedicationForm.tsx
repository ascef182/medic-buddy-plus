
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
import { useMedication } from "@/context/MedicationContext";

const AddMedicationForm: React.FC = () => {
  const { addMedication } = useMedication();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("comprimidos");
  const [frequency, setFrequency] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [notes, setNotes] = useState("");

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
      times: times.filter((t) => t), // Remove empty times
      notes,
      patient_id: null, // This will be set in the context
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dosage">Dosagem</Label>
          <Input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            placeholder="Ex: 1 comprimido, 10ml"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantidade</Label>
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
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comprimidos">Comprimidos</SelectItem>
              <SelectItem value="cápsulas">Cápsulas</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="ampolas">Ampolas</SelectItem>
              <SelectItem value="doses">Doses</SelectItem>
              <SelectItem value="gramas">Gramas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="frequency">Frequência</Label>
        <Select value={frequency} onValueChange={setFrequency} required>
          <SelectTrigger id="frequency" className="mt-1">
            <SelectValue placeholder="Selecione a frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Diário">Diário</SelectItem>
            <SelectItem value="A cada 12 horas">A cada 12 horas</SelectItem>
            <SelectItem value="A cada 8 horas">A cada 8 horas</SelectItem>
            <SelectItem value="A cada 6 horas">A cada 6 horas</SelectItem>
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

      <Button type="submit" className="w-full">
        Adicionar Medicamento
      </Button>
    </form>
  );
};

export default AddMedicationForm;
