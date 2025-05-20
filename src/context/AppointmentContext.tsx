
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMedication } from "@/context/MedicationContext";
import { useAuth } from "@/context/AuthContext";

export interface Appointment {
  id: string;
  title: string;
  doctor: string | null;
  location: string | null;
  appointment_date: Date;
  notes: string | null;
  notification_sent: boolean;
  confirmed: boolean;
}

export interface Exam {
  id: string;
  title: string;
  facility: string | null;
  exam_date: Date;
  results: string | null;
  notification_sent: boolean;
  confirmed: boolean;
}

export interface PatientEvent {
  id: string;
  title: string;
  location: string | null;
  event_date: Date;
  description: string | null;
  notification_sent: boolean;
  confirmed: boolean;
}

interface AppointmentContextType {
  appointments: Appointment[];
  exams: Exam[];
  events: PatientEvent[];
  loadAppointments: (patientId: string) => Promise<void>;
  loadExams: (patientId: string) => Promise<void>;
  loadEvents: (patientId: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, "id" | "notification_sent" | "confirmed">, patientId?: string) => Promise<void>;
  addExam: (exam: Omit<Exam, "id" | "notification_sent" | "confirmed">, patientId?: string) => Promise<void>;
  addEvent: (event: Omit<PatientEvent, "id" | "notification_sent" | "confirmed">, patientId?: string) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  updateExam: (id: string, exam: Partial<Exam>) => Promise<void>;
  updateEvent: (id: string, event: Partial<PatientEvent>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  confirmExam: (id: string) => Promise<void>;
  confirmEvent: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [events, setEvents] = useState<PatientEvent[]>([]);
  const { selectedPatientId } = useMedication();
  const { user } = useAuth();

  // Load appointments for the selected patient
  const loadAppointments = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("*")
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: true });

      if (error) throw error;

      if (data) {
        setAppointments(data.map(apt => ({
          ...apt,
          appointment_date: new Date(apt.appointment_date),
        })));
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar consultas: ${error.message}`);
      console.error("Error loading appointments:", error);
    }
  };

  // Load exams for the selected patient
  const loadExams = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .select("*")
        .eq("patient_id", patientId)
        .order("exam_date", { ascending: true });

      if (error) throw error;

      if (data) {
        setExams(data.map(exam => ({
          ...exam,
          exam_date: new Date(exam.exam_date),
        })));
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar exames: ${error.message}`);
      console.error("Error loading exams:", error);
    }
  };

  // Load events for the selected patient
  const loadEvents = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_events")
        .select("*")
        .eq("patient_id", patientId)
        .order("event_date", { ascending: true });

      if (error) throw error;

      if (data) {
        setEvents(data.map(event => ({
          ...event,
          event_date: new Date(event.event_date),
        })));
      }
    } catch (error: any) {
      toast.error(`Erro ao carregar eventos: ${error.message}`);
      console.error("Error loading events:", error);
    }
  };

  // Add a new appointment
  const addAppointment = async (
    appointment: Omit<Appointment, "id" | "notification_sent" | "confirmed">, 
    patientId?: string
  ) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .insert({
          patient_id: pid,
          title: appointment.title,
          doctor: appointment.doctor,
          location: appointment.location,
          appointment_date: appointment.appointment_date.toISOString(),
          notes: appointment.notes
        })
        .select()
        .single();

      if (error) throw error;

      setAppointments([...appointments, {
        ...data,
        appointment_date: new Date(data.appointment_date),
      }]);
      
      toast.success("Consulta adicionada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar consulta: ${error.message}`);
      console.error("Error adding appointment:", error);
    }
  };

  // Add a new exam
  const addExam = async (
    exam: Omit<Exam, "id" | "notification_sent" | "confirmed">, 
    patientId?: string
  ) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .insert({
          patient_id: pid,
          title: exam.title,
          facility: exam.facility,
          exam_date: exam.exam_date.toISOString(),
          results: exam.results
        })
        .select()
        .single();

      if (error) throw error;

      setExams([...exams, {
        ...data,
        exam_date: new Date(data.exam_date),
      }]);
      
      toast.success("Exame adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar exame: ${error.message}`);
      console.error("Error adding exam:", error);
    }
  };

  // Add a new event
  const addEvent = async (
    event: Omit<PatientEvent, "id" | "notification_sent" | "confirmed">, 
    patientId?: string
  ) => {
    const pid = patientId || selectedPatientId;
    if (!pid) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_events")
        .insert({
          patient_id: pid,
          title: event.title,
          location: event.location,
          event_date: event.event_date.toISOString(),
          description: event.description
        })
        .select()
        .single();

      if (error) throw error;

      setEvents([...events, {
        ...data,
        event_date: new Date(data.event_date),
      }]);
      
      toast.success("Evento adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar evento: ${error.message}`);
      console.error("Error adding event:", error);
    }
  };

  // Update an appointment
  const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
    try {
      const updates: any = { ...appointment };
      
      // Format date if it exists
      if (updates.appointment_date instanceof Date) {
        updates.appointment_date = updates.appointment_date.toISOString();
      }
      
      const { error } = await supabase
        .from("patient_appointments")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === id 
          ? { 
              ...apt, 
              ...appointment, 
              appointment_date: appointment.appointment_date || apt.appointment_date 
            }
          : apt
      ));
      
      toast.success("Consulta atualizada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar consulta: ${error.message}`);
      console.error("Error updating appointment:", error);
    }
  };

  // Update an exam
  const updateExam = async (id: string, exam: Partial<Exam>) => {
    try {
      const updates: any = { ...exam };
      
      // Format date if it exists
      if (updates.exam_date instanceof Date) {
        updates.exam_date = updates.exam_date.toISOString();
      }
      
      const { error } = await supabase
        .from("patient_exams")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setExams(exams.map(ex => 
        ex.id === id 
          ? { 
              ...ex, 
              ...exam, 
              exam_date: exam.exam_date || ex.exam_date 
            }
          : ex
      ));
      
      toast.success("Exame atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar exame: ${error.message}`);
      console.error("Error updating exam:", error);
    }
  };

  // Update an event
  const updateEvent = async (id: string, event: Partial<PatientEvent>) => {
    try {
      const updates: any = { ...event };
      
      // Format date if it exists
      if (updates.event_date instanceof Date) {
        updates.event_date = updates.event_date.toISOString();
      }
      
      const { error } = await supabase
        .from("patient_events")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setEvents(events.map(ev => 
        ev.id === id 
          ? { 
              ...ev, 
              ...event, 
              event_date: event.event_date || ev.event_date 
            }
          : ev
      ));
      
      toast.success("Evento atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar evento: ${error.message}`);
      console.error("Error updating event:", error);
    }
  };

  // Delete an appointment
  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAppointments(appointments.filter(apt => apt.id !== id));
      toast.success("Consulta removida com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover consulta: ${error.message}`);
      console.error("Error deleting appointment:", error);
    }
  };

  // Delete an exam
  const deleteExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setExams(exams.filter(ex => ex.id !== id));
      toast.success("Exame removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover exame: ${error.message}`);
      console.error("Error deleting exam:", error);
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEvents(events.filter(ev => ev.id !== id));
      toast.success("Evento removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover evento: ${error.message}`);
      console.error("Error deleting event:", error);
    }
  };

  // Confirm an appointment (mark as confirmed)
  const confirmAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_appointments")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setAppointments(appointments.map(apt => 
        apt.id === id 
          ? { ...apt, confirmed: true } 
          : apt
      ));
      
      toast.success("Consulta confirmada!");
    } catch (error: any) {
      toast.error(`Erro ao confirmar consulta: ${error.message}`);
      console.error("Error confirming appointment:", error);
    }
  };

  // Confirm an exam (mark as confirmed)
  const confirmExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setExams(exams.map(ex => 
        ex.id === id 
          ? { ...ex, confirmed: true } 
          : ex
      ));
      
      toast.success("Exame confirmado!");
    } catch (error: any) {
      toast.error(`Erro ao confirmar exame: ${error.message}`);
      console.error("Error confirming exam:", error);
    }
  };

  // Confirm an event (mark as confirmed)
  const confirmEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_events")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setEvents(events.map(ev => 
        ev.id === id 
          ? { ...ev, confirmed: true } 
          : ev
      ));
      
      toast.success("Evento confirmado!");
    } catch (error: any) {
      toast.error(`Erro ao confirmar evento: ${error.message}`);
      console.error("Error confirming event:", error);
    }
  };

  // Load all data whenever the selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId) {
      loadAppointments(selectedPatientId);
      loadExams(selectedPatientId);
      loadEvents(selectedPatientId);
    }
  }, [selectedPatientId]);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        exams,
        events,
        loadAppointments,
        loadExams,
        loadEvents,
        addAppointment,
        addExam,
        addEvent,
        updateAppointment,
        updateExam,
        updateEvent,
        deleteAppointment,
        deleteExam,
        deleteEvent,
        confirmAppointment,
        confirmExam,
        confirmEvent
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAppointment must be used within a AppointmentProvider");
  }
  return context;
};
