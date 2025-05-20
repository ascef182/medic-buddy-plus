
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, MapPin, Check, X, Plus, Calendar as CalendarOutlined } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppointment } from "@/context/AppointmentContext";
import { useMedication } from "@/context/MedicationContext";

const Events = () => {
  const { events, addEvent, updateEvent, deleteEvent, confirmEvent } = useAppointment();
  const { selectedPatientId } = useMedication();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [description, setDescription] = useState("");

  const handleAddEvent = () => {
    if (!title || !date) {
      return;
    }

    const eventDate = new Date(date);
    const [hours, minutes] = time.split(":");
    eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    addEvent({
      title,
      location,
      event_date: eventDate,
      description
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDate(new Date());
    setTime("09:00");
    setDescription("");
  };

  // Group events by month/year
  const groupedEvents = events.reduce((acc, event) => {
    const monthYear = format(event.event_date, 'MMMM yyyy', { locale: ptBR });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // Sort events within each month by date
  Object.keys(groupedEvents).forEach(monthYear => {
    groupedEvents[monthYear].sort((a, b) => 
      a.event_date.getTime() - b.event_date.getTime()
    );
  });

  // Get months in chronological order
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(groupedEvents[a][0].event_date);
    const dateB = new Date(groupedEvents[b][0].event_date);
    return dateA.getTime() - dateB.getTime();
  });

  const isUpcoming = (date: Date) => date > new Date();
  const isPast = (date: Date) => date < new Date();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do evento.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Evento</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Terapia Ocupacional"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Sala de Fisioterapia"
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes sobre o evento..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddEvent}>Adicionar Evento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {events.length > 0 ? (
          sortedMonths.map(monthYear => (
            <div key={monthYear} className="space-y-4">
              <h2 className="text-lg font-medium capitalize">{monthYear}</h2>
              
              {groupedEvents[monthYear].map((event) => {
                const isUpcomingEvent = isUpcoming(event.event_date);
                const isPastEvent = isPast(event.event_date);
                
                return (
                  <Card 
                    key={event.id} 
                    className={`border-l-4 ${
                      event.confirmed 
                        ? "border-l-green-500" 
                        : isUpcomingEvent 
                        ? "border-l-blue-500" 
                        : "border-l-orange-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CalendarOutlined className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{event.title}</h3>
                            {event.confirmed && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Confirmado
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {format(event.event_date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                            <p className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {format(event.event_date, "HH:mm")}
                            </p>
                            {event.location && (
                              <p className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {event.location}
                              </p>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="mt-2 text-sm">{event.description}</p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {!event.confirmed && isUpcomingEvent && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => confirmEvent(event.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => deleteEvent(event.id)}
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
            <CalendarOutlined className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum evento agendado</h3>
            <p className="mt-2 text-muted-foreground">
              Adicione eventos para o paciente para acompanhar as atividades.
            </p>
            <Button 
              onClick={() => setOpen(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Evento
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
