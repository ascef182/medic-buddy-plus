
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import MedicationCard from "@/components/MedicationCard";
import { useMedication } from "@/context/MedicationContext";

const Medications = () => {
  const { medications } = useMedication();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Medicamentos</h1>
        <Button onClick={() => navigate("/medicamentos/adicionar")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar medicamentos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMedications.length > 0 ? (
        <div className="space-y-4">
          {filteredMedications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Nenhum medicamento encontrado para sua busca"
              : "Nenhum medicamento cadastrado"}
          </p>
          {!searchTerm && (
            <Button onClick={() => navigate("/medicamentos/adicionar")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Medicamento
            </Button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Medications;
