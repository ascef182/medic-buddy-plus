
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import AddMedicationForm from "@/components/AddMedicationForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddMedication = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/medicamentos")}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Adicionar Novo Medicamento</h1>
          <p className="text-muted-foreground">
            Preencha as informações do medicamento abaixo
          </p>
        </div>

        <AddMedicationForm />
      </div>
    </Layout>
  );
};

export default AddMedication;
