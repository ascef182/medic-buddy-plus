
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useMedication } from "./MedicationContext";

export interface AppointmentType {
  id: string;
  patient_id: string;
  title: string;
  doctor?: string;
  location?: string;
  appointment_date: Date;
  notes?: string;
  confirmed: boolean;
  notification_sent: boolean;
  created_at: Date;
}

export interface EventType {
  id: string;
  patient_id: string;
  title: string;
  location?: string;
  event_date: Date;
  description?: string;
  confirmed: boolean;
  notification_sent: boolean;
  created_at: Date;
}

export interface ExamType {
  id: string;
  patient_id: string;
  title: string;
  facility?: string;
  exam_date: Date;
  results?: string;
  confirmed: boolean;
  notification_sent: boolean;
  created_at: Date;
}

interface AppointmentContextType {
  appointments: AppointmentType[];
  events: EventType[];
  exams: ExamType[];
  addAppointment: (appointment: Omit<AppointmentType, "id" | "confirmed" | "notification_sent" | "created_at">) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<AppointmentType>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  addEvent: (event: Omit<EventType, "id" | "confirmed" | "notification_sent" | "created_at">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  confirmEvent: (id: string) => Promise<void>;
  addExam: (exam: Omit<ExamType, "id" | "confirmed" | "notification_sent" | "created_at">) => Promise<void>;
  updateExam: (id: string, updates: Partial<ExamType>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  confirmExam: (id: string) => Promise<void>;
  loading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [exams, setExams] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedPatientId } = useMedication();

  // Load data when patient changes
  useEffect(() => {
    if (selectedPatientId) {
      loadAppointments();
      loadEvents();
      loadExams();
    } else {
      setAppointments([]);
      setEvents([]);
      setExams([]);
    }
  }, [selectedPatientId]);

  const loadAppointments = async () => {
    if (!selectedPatientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("*")
        .eq("patient_id", selectedPatientId)
        .order("appointment_date", { ascending: true });

      if (error) throw error;

      const formattedAppointments: AppointmentType[] = data.map(item => ({
        ...item,
        appointment_date: new Date(item.appointment_date),
        created_at: new Date(item.created_at),
      }));

      setAppointments(formattedAppointments);
    } catch (error: any) {
      toast.error(`Erro ao carregar consultas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    if (!selectedPatientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patient_events")
        .select("*")
        .eq("patient_id", selectedPatientId)
        .order("event_date", { ascending: true });

      if (error) throw error;

      const formattedEvents: EventType[] = data.map(item => ({
        ...item,
        event_date: new Date(item.event_date),
        created_at: new Date(item.created_at),
      }));

      setEvents(formattedEvents);
    } catch (error: any) {
      toast.error(`Erro ao carregar eventos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadExams = async () => {
    if (!selectedPatientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .select("*")
        .eq("patient_id", selectedPatientId)
        .order("exam_date", { ascending: true });

      if (error) throw error;

      const formattedExams: ExamType[] = data.map(item => ({
        ...item,
        exam_date: new Date(item.exam_date),
        created_at: new Date(item.created_at),
      }));

      setExams(formattedExams);
    } catch (error: any) {
      toast.error(`Erro ao carregar exames: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<AppointmentType, "id" | "confirmed" | "notification_sent" | "created_at">) => {
    if (!selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .insert({
          ...appointmentData,
          patient_id: selectedPatientId,
          appointment_date: appointmentData.appointment_date.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newAppointment: AppointmentType = {
        ...data,
        appointment_date: new Date(data.appointment_date),
        created_at: new Date(data.created_at),
      };

      setAppointments(prev => [...prev, newAppointment]);
      toast.success("Consulta adicionada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar consulta: ${error.message}`);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      const updateData = {
        ...updates,
        appointment_date: updates.appointment_date?.toISOString(),
      };

      const { error } = await supabase
        .from("patient_appointments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setAppointments(prev =>
        prev.map(appointment =>
          appointment.id === id
            ? { ...appointment, ...updates }
            : appointment
        )
      );
      toast.success("Consulta atualizada com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar consulta: ${error.message}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast.success("Consulta removida com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover consulta: ${error.message}`);
    }
  };

  const confirmAppointment = async (id: string) => {
    await updateAppointment(id, { confirmed: true });
  };

  const addEvent = async (eventData: Omit<EventType, "id" | "confirmed" | "notification_sent" | "created_at">) => {
    if (!selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_events")
        .insert({
          ...eventData,
          patient_id: selectedPatientId,
          event_date: eventData.event_date.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: EventType = {
        ...data,
        event_date: new Date(data.event_date),
        created_at: new Date(data.created_at),
      };

      setEvents(prev => [...prev, newEvent]);
      toast.success("Evento adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar evento: ${error.message}`);
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    try {
      const updateData = {
        ...updates,
        event_date: updates.event_date?.toISOString(),
      };

      const { error } = await supabase
        .from("patient_events")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setEvents(prev =>
        prev.map(event =>
          event.id === id
            ? { ...event, ...updates }
            : event
        )
      );
      toast.success("Evento atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar evento: ${error.message}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success("Evento removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover evento: ${error.message}`);
    }
  };

  const confirmEvent = async (id: string) => {
    await updateEvent(id, { confirmed: true });
  };

  const addExam = async (examData: Omit<ExamType, "id" | "confirmed" | "notification_sent" | "created_at">) => {
    if (!selectedPatientId) return;

    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .insert({
          ...examData,
          patient_id: selectedPatientId,
          exam_date: examData.exam_date.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      const newExam: ExamType = {
        ...data,
        exam_date: new Date(data.exam_date),
        created_at: new Date(data.created_at),
      };

      setExams(prev => [...prev, newExam]);
      toast.success("Exame adicionado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao adicionar exame: ${error.message}`);
    }
  };

  const updateExam = async (id: string, updates: Partial<ExamType>) => {
    try {
      const updateData = {
        ...updates,
        exam_date: updates.exam_date?.toISOString(),
      };

      const { error } = await supabase
        .from("patient_exams")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setExams(prev =>
        prev.map(exam =>
          exam.id === id
            ? { ...exam, ...updates }
            : exam
        )
      );
      toast.success("Exame atualizado com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao atualizar exame: ${error.message}`);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setExams(prev => prev.filter(exam => exam.id !== id));
      toast.success("Exame removido com sucesso!");
    } catch (error: any) {
      toast.error(`Erro ao remover exame: ${error.message}`);
    }
  };

  const confirmExam = async (id: string) => {
    await updateExam(id, { confirmed: true });
  };

  const value = {
    appointments,
    events,
    exams,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    addEvent,
    updateEvent,
    deleteEvent,
    confirmEvent,
    addExam,
    updateExam,
    deleteExam,
    confirmExam,
    loading,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};
