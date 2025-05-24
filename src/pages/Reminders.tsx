import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication } from "@/context/MedicationContext";

const Reminders = () => {
  const { medications } = useMedication();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Lembretes de Medicamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe seus medicamentos e horários.
        </p>
      </div>

      <div className="space-y-4">
        {medications.map((medication) => {
          const isOverdue = medication.last_taken 
            ? new Date(medication.last_taken).toDateString() !== new Date().toDateString()
            : true;
          const lastTakenDate = medication.last_taken 
            ? new Date(medication.last_taken) 
            : null;

          return (
            <Card key={medication.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {medication.name}
                  {isOverdue ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Dosagem: {medication.dosage}</p>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {medication.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Frequência: {medication.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Próxima dose: {medication.times && medication.times.length > 0 ? medication.times[0] : "Não definido"}
                    </p>
                    {lastTakenDate && (
                      <p className="text-sm text-muted-foreground">
                        Última vez tomado:{" "}
                        {lastTakenDate.toLocaleDateString()}
                      </p>
                    )}
                    {isOverdue && (
                      <p className="text-sm text-red-500 font-medium">
                        <Clock className="inline-block h-4 w-4 mr-1 align-middle" />
                        Hora de tomar!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Reminders;
