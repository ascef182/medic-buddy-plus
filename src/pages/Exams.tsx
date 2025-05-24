
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, FileText, Check, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppointment } from "@/context/AppointmentContext";
import { useMedication } from "@/context/MedicationContext";

const Exams = () => {
  const { exams, addExam, updateExam, deleteExam, confirmExam } = useAppointment();
  const { selectedPatientId } = useMedication();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [results, setResults] = useState("");

  const handleAddExam = () => {
    if (!title || !date) {
      return;
    }

    const examDate = new Date(date);
    const [hours, minutes] = time.split(":");
    examDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    addExam({
      patient_id: selectedPatientId!,
      title,
      facility,
      exam_date: examDate,
      results
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setFacility("");
    setDate(new Date());
    setTime("09:00");
    setResults("");
  };

  // Group exams by month/year
  const groupedExams = exams.reduce((acc, exam) => {
    const monthYear = format(exam.exam_date, 'MMMM yyyy', { locale: ptBR });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  // Sort exams within each month by date
  Object.keys(groupedExams).forEach(monthYear => {
    groupedExams[monthYear].sort((a, b) => 
      a.exam_date.getTime() - b.exam_date.getTime()
    );
  });

  // Get months in chronological order
  const sortedMonths = Object.keys(groupedExams).sort((a, b) => {
    const dateA = new Date(groupedExams[a][0].exam_date);
    const dateB = new Date(groupedExams[b][0].exam_date);
    return dateA.getTime() - dateB.getTime();
  });

  const isUpcoming = (date: Date) => date > new Date();
  const isPast = (date: Date) => date < new Date();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Exames</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exame
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Exame</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do exame.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Exame</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Hemograma Completo"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="facility">Local/Laboratório</Label>
                <Input
                  id="facility"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  placeholder="Ex: Laboratório Central"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="results">Resultados/Observações</Label>
                <Textarea
                  id="results"
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  placeholder="Resultados do exame ou informações adicionais..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddExam}>Adicionar Exame</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {exams.length > 0 ? (
          sortedMonths.map(monthYear => (
            <div key={monthYear} className="space-y-4">
              <h2 className="text-lg font-medium capitalize">{monthYear}</h2>
              
              {groupedExams[monthYear].map((exam) => {
                const isUpcomingExam = isUpcoming(exam.exam_date);
                const isPastExam = isPast(exam.exam_date);
                
                return (
                  <Card 
                    key={exam.id} 
                    className={`border-l-4 ${
                      exam.confirmed 
                        ? "border-l-green-500" 
                        : isUpcomingExam 
                        ? "border-l-blue-500" 
                        : "border-l-orange-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{exam.title}</h3>
                            {exam.confirmed && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Confirmado
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(exam.exam_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {format(exam.exam_date, "HH:mm")}
                            </p>
                            {exam.facility && (
                              <p className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {exam.facility}
                              </p>
                            )}
                          </div>
                          
                          {exam.results && (
                            <div className="mt-3 p-2 bg-muted/50 rounded-md">
                              <p className="text-sm font-medium">Resultados:</p>
                              <p className="text-sm">{exam.results}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {!exam.confirmed && isUpcomingExam && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => confirmExam(exam.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => deleteExam(exam.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum exame agendado</h3>
            <p className="mt-2 text-muted-foreground">
              Adicione exames para o paciente para acompanhar os agendamentos.
            </p>
            <Button 
              onClick={() => setOpen(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Exame
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Exams;
