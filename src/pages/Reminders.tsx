
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertTriangle, Bell, BellRing } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useMedication } from "@/context/MedicationContext";
import MedicationClock from "@/components/MedicationClock";
import MedicationStatus from "@/components/MedicationStatus";

const Reminders = () => {
  const { medications, takeMedication, getNextDoseTime, getMedicationStatus } = useMedication();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Group medications by status
  const overdueOrUpcoming = medications.filter(med => {
    const status = getMedicationStatus(med);
    return status === 'overdue' || status === 'on_time';
  });

  const problemMedications = medications.filter(med => {
    const status = getMedicationStatus(med);
    return status === 'low_stock' || status === 'expiring_soon' || status === 'expired';
  });

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Lembretes de Medicamentos</h1>
            <p className="text-muted-foreground">
              Acompanhe seus medicamentos e horários.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Agora</div>
            <div className="text-lg font-medium">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {overdueOrUpcoming.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Próximas doses
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {medications.filter(m => getMedicationStatus(m) === 'low_stock').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estoque baixo
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {medications.filter(m => getMedicationStatus(m) === 'expiring_soon').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vencendo
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {medications.filter(m => getMedicationStatus(m) === 'overdue').length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Atrasados
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        {/* Urgent Medications */}
        {overdueOrUpcoming.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximas Doses
            </h2>
            <div className="space-y-4">
              {overdueOrUpcoming.map((medication) => {
                const status = getMedicationStatus(medication);
                const nextDoseTime = getNextDoseTime(medication);
                const isTakenToday = medication.last_taken 
                  ? new Date(medication.last_taken).toDateString() === new Date().toDateString()
                  : false;

                return (
                  <Card key={medication.id} className={`${
                    status === 'overdue' ? 'border-red-300 bg-red-50' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {medication.name}
                          {status === 'overdue' && (
                            <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                          )}
                        </span>
                        <Button
                          variant={isTakenToday ? "outline" : status === 'overdue' ? "destructive" : "default"}
                          size="sm"
                          onClick={() => takeMedication(medication.id)}
                          disabled={isTakenToday || medication.quantity <= 0}
                        >
                          {isTakenToday ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Tomado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Bell className="h-4 w-4" />
                              Marcar Tomado
                            </span>
                          )}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm">
                            <strong>Dosagem:</strong> {medication.dosage}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Tipo:</strong> {medication.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Frequência:</strong> {medication.frequency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Estoque:</strong> {medication.quantity} {medication.unit}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <MedicationClock 
                            medication={medication} 
                            nextDoseTime={nextDoseTime} 
                          />
                          <MedicationStatus 
                            medication={medication} 
                            status={status} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Problem Medications */}
        {problemMedications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Medicamentos que Precisam de Atenção
            </h2>
            <div className="space-y-4">
              {problemMedications.map((medication) => {
                const status = getMedicationStatus(medication);

                return (
                  <Card key={medication.id} className="border-orange-300 bg-orange-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        {medication.name}
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm">
                            <strong>Dosagem:</strong> {medication.dosage}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Estoque:</strong> {medication.quantity} {medication.unit}
                          </p>
                          {medication.expiry_date && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Validade:</strong> {medication.expiry_date.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <MedicationStatus 
                            medication={medication} 
                            status={status} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No medications */}
        {medications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum medicamento cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione medicamentos para começar a receber lembretes.
            </p>
            <Button onClick={() => window.location.href = '/medicamentos/adicionar'}>
              Adicionar Medicamento
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reminders;
