
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

export interface AppointmentType {
  id: string;
  patient_id: string;
  title: string;
  doctor?: string | null;
  location?: string | null;
  appointment_date: string;
  notes?: string | null;
  confirmed: boolean;
  created_at: string;
  notification_sent: boolean;
}

export interface EventType {
  id: string;
  patient_id: string;
  title: string;
  location?: string | null;
  event_date: string;
  description?: string | null;
  confirmed: boolean;
  created_at: string;
  notification_sent: boolean;
}

export interface ExamType {
  id: string;
  patient_id: string;
  title: string;
  facility?: string | null;
  exam_date: string;
  results?: string | null;
  confirmed: boolean;
  created_at: string;
  notification_sent: boolean;
}

// Types for creating new records (including patient_id)
export type CreateAppointmentType = Omit<AppointmentType, "id" | "created_at" | "notification_sent" | "confirmed">;
export type CreateEventType = Omit<EventType, "id" | "created_at" | "notification_sent" | "confirmed">;
export type CreateExamType = Omit<ExamType, "id" | "created_at" | "notification_sent" | "confirmed">;

interface AppointmentContextType {
  appointments: AppointmentType[];
  events: EventType[];
  exams: ExamType[];
  addAppointment: (appointment: CreateAppointmentType) => Promise<void>;
  addEvent: (event: CreateEventType) => Promise<void>;
  addExam: (exam: CreateExamType) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<AppointmentType>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventType>) => Promise<void>;
  updateExam: (id: string, updates: Partial<ExamType>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  confirmEvent: (id: string) => Promise<void>;
  confirmExam: (id: string) => Promise<void>;
  loadAppointmentData: (patientId: string) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [exams, setExams] = useState<ExamType[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      // Fetch the selected patient ID from localStorage
      const selectedPatientId = localStorage.getItem("selectedPatientId");
      if (selectedPatientId) {
        await loadAppointmentData(selectedPatientId);
      }
    };

    fetchAllData();
  }, [user]);

  const addAppointment = async (appointment: CreateAppointmentType) => {
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .insert([appointment])
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setAppointments(prevAppointments => [...prevAppointments, data[0] as AppointmentType]);
        toast.success('Consulta adicionada com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar consulta: ${error.message}`);
    }
  };

  const addEvent = async (event: CreateEventType) => {
    try {
      const { data, error } = await supabase
        .from("patient_events")
        .insert([event])
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEvents(prevEvents => [...prevEvents, data[0] as EventType]);
        toast.success('Evento adicionado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar evento: ${error.message}`);
    }
  };

  const addExam = async (exam: CreateExamType) => {
    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .insert([exam])
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setExams(prevExams => [...prevExams, data[0] as ExamType]);
        toast.success('Exame adicionado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar exame: ${error.message}`);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<AppointmentType>) => {
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .update(updates)
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment => (appointment.id === id ? data[0] as AppointmentType : appointment))
        );
        toast.success('Consulta atualizada com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao atualizar consulta: ${error.message}`);
    }
  };

  const updateEvent = async (id: string, updates: Partial<EventType>) => {
    try {
      const { data, error } = await supabase
        .from("patient_events")
        .update(updates)
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEvents(prevEvents =>
          prevEvents.map(event => (event.id === id ? data[0] as EventType : event))
        );
        toast.success('Evento atualizado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao atualizar evento: ${error.message}`);
    }
  };

  const updateExam = async (id: string, updates: Partial<ExamType>) => {
    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .update(updates)
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setExams(prevExams =>
          prevExams.map(exam => (exam.id === id ? data[0] as ExamType : exam))
        );
        toast.success('Exame atualizado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao atualizar exame: ${error.message}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_appointments")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
      toast.success('Consulta removida com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao remover consulta: ${error.message}`);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_events")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      toast.success('Evento removido com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao remover evento: ${error.message}`);
    }
  };

  const deleteExam = async (id: string) => {
    try {
      const { error } = await supabase
        .from("patient_exams")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setExams(prevExams => prevExams.filter(exam => exam.id !== id));
      toast.success('Exame removido com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao remover exame: ${error.message}`);
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_appointments")
        .update({ confirmed: true })
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment => (appointment.id === id ? data[0] as AppointmentType : appointment))
        );
        toast.success('Consulta confirmada com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao confirmar consulta: ${error.message}`);
    }
  };

  const confirmEvent = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_events")
        .update({ confirmed: true })
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setEvents(prevEvents =>
          prevEvents.map(event => (event.id === id ? data[0] as EventType : event))
        );
        toast.success('Evento confirmado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao confirmar evento: ${error.message}`);
    }
  };

  const confirmExam = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("patient_exams")
        .update({ confirmed: true })
        .eq("id", id)
        .select("*");

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setExams(prevExams =>
          prevExams.map(exam => (exam.id === id ? data[0] as ExamType : exam))
        );
        toast.success('Exame confirmado com sucesso!');
      }
    } catch (error: any) {
      toast.error(`Erro ao confirmar exame: ${error.message}`);
    }
  };

  const loadAppointmentData = async (patientId: string) => {
    try {
      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("patient_appointments")
        .select("*")
        .eq("patient_id", patientId)
        .order("appointment_date");

      if (appointmentsError) {
        throw appointmentsError;
      }

      setAppointments((appointmentsData || []) as AppointmentType[]);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("patient_events")
        .select("*")
        .eq("patient_id", patientId)
        .order("event_date");

      if (eventsError) {
        throw eventsError;
      }

      setEvents((eventsData || []) as EventType[]);

      // Fetch exams
      const { data: examsData, error: examsError } = await supabase
        .from("patient_exams")
        .select("*")
        .eq("patient_id", patientId)
        .order("exam_date");

      if (examsError) {
        throw examsError;
      }

      setExams((examsData || []) as ExamType[]);

    } catch (error: any) {
      toast.error(`Erro ao carregar dados: ${error.message}`);
    }
  };

  const value: AppointmentContextType = {
    appointments,
    events,
    exams,
    addAppointment,
    addEvent,
    addExam,
    updateAppointment,
    updateEvent,
    updateExam,
    deleteAppointment,
    deleteEvent,
    deleteExam,
    confirmAppointment,
    confirmEvent,
    confirmExam,
    loadAppointmentData,
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
