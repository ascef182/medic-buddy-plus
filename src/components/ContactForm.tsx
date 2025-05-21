
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
import { useMedication } from "@/context/MedicationContext";

const ContactForm: React.FC = () => {
  const { addContact } = useMedication();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addContact({
      name,
      email,
      phone,
      relation,
      patient_id: "", // This will be set in the context
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setRelation("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Contato</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nome completo"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="relation">Relação</Label>
        <Select value={relation} onValueChange={setRelation} required>
          <SelectTrigger id="relation" className="mt-1">
            <SelectValue placeholder="Selecione o parentesco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Filho/a">Filho/a</SelectItem>
            <SelectItem value="Cônjuge">Cônjuge</SelectItem>
            <SelectItem value="Irmão/ã">Irmão/ã</SelectItem>
            <SelectItem value="Cuidador">Cuidador</SelectItem>
            <SelectItem value="Médico">Médico</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(00) 00000-0000"
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        Adicionar Contato
      </Button>
    </form>
  );
};

export default ContactForm;
