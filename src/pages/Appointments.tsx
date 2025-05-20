
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Check, X, Plus, CalendarPlus } from "lucide-react";
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

const Appointments = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, confirmAppointment } = useAppointment();
  const { selectedPatientId } = useMedication();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  const handleAddAppointment = () => {
    if (!title || !date) {
      return;
    }

    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(":");
    appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    addAppointment({
      title,
      doctor,
      location,
      appointment_date: appointmentDate,
      notes
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDoctor("");
    setLocation("");
    setDate(new Date());
    setTime("09:00");
    setNotes("");
  };

  // Group appointments by month/year
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const monthYear = format(appointment.appointment_date, 'MMMM yyyy', { locale: ptBR });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

  // Sort appointments within each month by date
  Object.keys(groupedAppointments).forEach(monthYear => {
    groupedAppointments[monthYear].sort((a, b) => 
      a.appointment_date.getTime() - b.appointment_date.getTime()
    );
  });

  // Get months in chronological order
  const sortedMonths = Object.keys(groupedAppointments).sort((a, b) => {
    const dateA = new Date(groupedAppointments[a][0].appointment_date);
    const dateB = new Date(groupedAppointments[b][0].appointment_date);
    return dateA.getTime() - dateB.getTime();
  });

  const isUpcoming = (date: Date) => date > new Date();
  const isPast = (date: Date) => date < new Date();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Consultas Médicas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Consulta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Consulta</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da consulta médica.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Consulta com cardiologista"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="doctor">Médico</Label>
                <Input
                  id="doctor"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="Ex: Dr. Silva"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Hospital São Lucas, sala 302"
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
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a consulta..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddAppointment}>Adicionar Consulta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {appointments.length > 0 ? (
          sortedMonths.map(monthYear => (
            <div key={monthYear} className="space-y-4">
              <h2 className="text-lg font-medium capitalize">{monthYear}</h2>
              
              {groupedAppointments[monthYear].map((appointment) => {
                const isUpcomingAppointment = isUpcoming(appointment.appointment_date);
                const isPastAppointment = isPast(appointment.appointment_date);
                
                return (
                  <Card 
                    key={appointment.id} 
                    className={`border-l-4 ${
                      appointment.confirmed 
                        ? "border-l-green-500" 
                        : isUpcomingAppointment 
                        ? "border-l-blue-500" 
                        : "border-l-orange-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CalendarPlus className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{appointment.title}</h3>
                            {appointment.confirmed && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Confirmado
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {format(appointment.appointment_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {format(appointment.appointment_date, "HH:mm")}
                            </p>
                            {appointment.doctor && (
                              <p className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                {appointment.doctor}
                              </p>
                            )}
                            {appointment.location && (
                              <p className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {appointment.location}
                              </p>
                            )}
                          </div>
                          
                          {appointment.notes && (
                            <p className="mt-2 text-sm">{appointment.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {!appointment.confirmed && isUpcomingAppointment && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => confirmAppointment(appointment.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => deleteAppointment(appointment.id)}
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
            <CalendarPlus className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhuma consulta agendada</h3>
            <p className="mt-2 text-muted-foreground">
              Adicione consultas médicas para o paciente para acompanhar os agendamentos.
            </p>
            <Button 
              onClick={() => setOpen(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeira Consulta
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
