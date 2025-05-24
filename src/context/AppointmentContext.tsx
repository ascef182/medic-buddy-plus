
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMedication } from '@/context/MedicationContext';

export type AppointmentType = {
  id: string;
  patient_id: string;
  title: string;
  doctor?: string;
  location?: string;
  appointment_date: string;
  notes?: string;
  confirmed?: boolean;
  notification_sent?: boolean;
  created_at?: string;
};

export type EventType = {
  id: string;
  patient_id: string;
  title: string;
  location?: string;
  event_date: string;
  description?: string;
  confirmed?: boolean;
  notification_sent?: boolean;
  created_at?: string;
};

export type ExamType = {
  id: string;
  patient_id: string;
  title: string;
  exam_date: string;
  facility?: string;
  results?: string;
  confirmed?: boolean;
  notification_sent?: boolean;
  created_at?: string;
};

export interface AppointmentContextType {
  appointments: AppointmentType[];
  events: EventType[];
  exams: ExamType[];
  addAppointment: (appointment: Omit<AppointmentType, "id" | "patient_id" | "created_at">) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<AppointmentType>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  addEvent: (event: Omit<EventType, "id" | "patient_id" | "created_at">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  confirmEvent: (id: string) => Promise<void>;
  addExam: (exam: Omit<ExamType, "id" | "patient_id" | "created_at">) => Promise<void>;
  updateExam: (id: string, updates: Partial<ExamType>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  confirmExam: (id: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [exams, setExams] = useState<ExamType[]>([]);
  const { selectedPatientId } = useMedication();

  const loadAppointments = async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("*")
        .eq("patient_id", patientId)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      if (data) {
        setAppointments(data.map(appointment => ({
          ...appointment,
          appointment_date: appointment.appointment_date,
          created_at: appointment.created_at || undefined
        })));
      }
    } catch (error: any) {
      console.error("Failed to load appointments:", error);
      toast.error(`Erro ao carregar consultas: ${error.message}`);
    }
  };

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
          event_date: event.event_date,
          created_at: event.created_at || undefined
        })));
      }
    } catch (error: any) {
      console.error("Failed to load events:", error);
      toast.error(`Erro ao carregar eventos: ${error.message}`);
    }
  };

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
          exam_date: exam.exam_date,
          created_at: exam.created_at || undefined
        })));
      }
    } catch (error: any) {
      console.error("Failed to load exams:", error);
      toast.error(`Erro ao carregar exames: ${error.message}`);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      loadAppointments(selectedPatientId);
      loadEvents(selectedPatientId);
      loadExams(selectedPatientId);
    } else {
      setAppointments([]);
      setEvents([]);
      setExams([]);
    }
  }, [selectedPatientId]);

  // Appointment CRUD operations
  const addAppointment = async (appointment: Omit<AppointmentType, "id" | "patient_id" | "created_at">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .insert({
          ...appointment,
          patient_id: selectedPatientId,
          appointment_date: appointment.appointment_date,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newAppointment: AppointmentType = {
          ...data,
          appointment_date: data.appointment_date,
          created_at: data.created_at || undefined
        };
        setAppointments(prev => [...prev, newAppointment]);
        toast.success("Consulta adicionada com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to add appointment:", error);
      toast.error(`Erro ao adicionar consulta: ${error.message}`);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      const updateData = { ...updates };
      delete updateData.patient_id;

      const { error } = await supabase
        .from("patient_appointments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setAppointments(prev =>
        prev.map(app => app.id === id ? { ...app, ...updates } : app)
      );
      toast.success("Consulta atualizada com sucesso!");
    } catch (error: any) {
      console.error("Failed to update appointment:", error);
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

      setAppointments(prev => prev.filter(app => app.id !== id));
      toast.success("Consulta removida com sucesso!");
    } catch (error: any) {
      console.error("Failed to delete appointment:", error);
      toast.error(`Erro ao remover consulta: ${error.message}`);
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_appointments")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setAppointments(prev =>
        prev.map(app => app.id === id ? { ...app, confirmed: true } : app)
      );
      toast.success("Consulta confirmada!");
    } catch (error: any) {
      console.error("Failed to confirm appointment:", error);
      toast.error(`Erro ao confirmar consulta: ${error.message}`);
    }
  };

  // Event CRUD operations
  const addEvent = async (event: Omit<EventType, "id" | "patient_id" | "created_at">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_events")
        .insert({
          ...event,
          patient_id: selectedPatientId,
          event_date: event.event_date,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newEvent: EventType = {
          ...data,
          event_date: data.event_date,
          created_at: data.created_at || undefined
        };
        setEvents(prev => [...prev, newEvent]);
        toast.success("Evento adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to add event:", error);
      toast.error(`Erro ao adicionar evento: ${error.message}`);
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    try {
      const updateData = { ...updates };
      delete updateData.patient_id;

      const { error } = await supabase
        .from("patient_events")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setEvents(prev =>
        prev.map(evt => evt.id === id ? { ...evt, ...updates } : evt)
      );
      toast.success("Evento atualizado com sucesso!");
    } catch (error: any) {
      console.error("Failed to update event:", error);
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

      setEvents(prev => prev.filter(evt => evt.id !== id));
      toast.success("Evento removido com sucesso!");
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      toast.error(`Erro ao remover evento: ${error.message}`);
    }
  };

  const confirmEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_events")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setEvents(prev =>
        prev.map(evt => evt.id === id ? { ...evt, confirmed: true } : evt)
      );
      toast.success("Evento confirmado!");
    } catch (error: any) {
      console.error("Failed to confirm event:", error);
      toast.error(`Erro ao confirmar evento: ${error.message}`);
    }
  };

  // Exam CRUD operations
  const addExam = async (exam: Omit<ExamType, "id" | "patient_id" | "created_at">) => {
    if (!selectedPatientId) {
      toast.error("Nenhum paciente selecionado");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .insert({
          ...exam,
          patient_id: selectedPatientId,
          exam_date: exam.exam_date,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const newExam: ExamType = {
          ...data,
          exam_date: data.exam_date,
          created_at: data.created_at || undefined
        };
        setExams(prev => [...prev, newExam]);
        toast.success("Exame adicionado com sucesso!");
      }
    } catch (error: any) {
      console.error("Failed to add exam:", error);
      toast.error(`Erro ao adicionar exame: ${error.message}`);
    }
  };

  const updateExam = async (id: string, updates: Partial<ExamType>) => {
    try {
      const updateData = { ...updates };
      delete updateData.patient_id;

      const { error } = await supabase
        .from("patient_exams")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setExams(prev =>
        prev.map(exam => exam.id === id ? { ...exam, ...updates } : exam)
      );
      toast.success("Exame atualizado com sucesso!");
    } catch (error: any) {
      console.error("Failed to update exam:", error);
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
      console.error("Failed to delete exam:", error);
      toast.error(`Erro ao remover exame: ${error.message}`);
    }
  };

  const confirmExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .update({ confirmed: true })
        .eq("id", id);

      if (error) throw error;

      setExams(prev =>
        prev.map(exam => exam.id === id ? { ...exam, confirmed: true } : exam)
      );
      toast.success("Exame confirmado!");
    } catch (error: any) {
      console.error("Failed to confirm exam:", error);
      toast.error(`Erro ao confirmar exame: ${error.message}`);
    }
  };

  const value: AppointmentContextType = {
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
    confirmExam
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
