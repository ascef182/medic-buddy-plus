export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      medication_alerts: {
        Row: {
          alert_contact_id: string | null
          alert_sent: boolean | null
          alert_time: string
          confirmed: boolean | null
          created_at: string
          id: string
          medication_id: string
          patient_id: string
        }
        Insert: {
          alert_contact_id?: string | null
          alert_sent?: boolean | null
          alert_time: string
          confirmed?: boolean | null
          created_at?: string
          id?: string
          medication_id: string
          patient_id: string
        }
        Update: {
          alert_contact_id?: string | null
          alert_sent?: boolean | null
          alert_time?: string
          confirmed?: boolean | null
          created_at?: string
          id?: string
          medication_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_alerts_alert_contact_id_fkey"
            columns: ["alert_contact_id"]
            isOneToOne: false
            referencedRelation: "patient_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_alerts_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "patient_medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_allergies: {
        Row: {
          allergy: string
          id: string
          patient_id: string
        }
        Insert: {
          allergy: string
          id?: string
          patient_id: string
        }
        Update: {
          allergy?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_appointments: {
        Row: {
          appointment_date: string
          confirmed: boolean | null
          created_at: string
          doctor: string | null
          id: string
          location: string | null
          notes: string | null
          notification_sent: boolean | null
          patient_id: string
          title: string
        }
        Insert: {
          appointment_date: string
          confirmed?: boolean | null
          created_at?: string
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          notification_sent?: boolean | null
          patient_id: string
          title: string
        }
        Update: {
          appointment_date?: string
          confirmed?: boolean | null
          created_at?: string
          doctor?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          notification_sent?: boolean | null
          patient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_chronic_diseases: {
        Row: {
          disease: string
          id: string
          patient_id: string
        }
        Insert: {
          disease: string
          id?: string
          patient_id: string
        }
        Update: {
          disease?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_chronic_diseases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_contacts: {
        Row: {
          email: string | null
          id: string
          name: string
          patient_id: string
          phone: string | null
          relation: string
        }
        Insert: {
          email?: string | null
          id?: string
          name: string
          patient_id: string
          phone?: string | null
          relation: string
        }
        Update: {
          email?: string | null
          id?: string
          name?: string
          patient_id?: string
          phone?: string | null
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_contacts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_diagnoses: {
        Row: {
          diagnosis: string
          id: string
          patient_id: string
        }
        Insert: {
          diagnosis: string
          id?: string
          patient_id: string
        }
        Update: {
          diagnosis?: string
          id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_diagnoses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_doctors: {
        Row: {
          id: string
          name: string
          patient_id: string
          phone: string | null
          specialty: string | null
        }
        Insert: {
          id?: string
          name: string
          patient_id: string
          phone?: string | null
          specialty?: string | null
        }
        Update: {
          id?: string
          name?: string
          patient_id?: string
          phone?: string | null
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_doctors_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_emergency_signals: {
        Row: {
          created_at: string
          id: string
          location: string | null
          message: string | null
          patient_id: string
          resolved: boolean | null
          resolved_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          patient_id: string
          resolved?: boolean | null
          resolved_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          patient_id?: string
          resolved?: boolean | null
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_emergency_signals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_emergency_signals_patient_id_fkey1"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_events: {
        Row: {
          confirmed: boolean | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          notification_sent: boolean | null
          patient_id: string
          title: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          notification_sent?: boolean | null
          patient_id: string
          title: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          notification_sent?: boolean | null
          patient_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_exams: {
        Row: {
          confirmed: boolean | null
          created_at: string
          exam_date: string
          facility: string | null
          id: string
          notification_sent: boolean | null
          patient_id: string
          results: string | null
          title: string
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          exam_date: string
          facility?: string | null
          id?: string
          notification_sent?: boolean | null
          patient_id: string
          results?: string | null
          title: string
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          exam_date?: string
          facility?: string | null
          id?: string
          notification_sent?: boolean | null
          patient_id?: string
          results?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_exams_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_medications: {
        Row: {
          alert_threshold: number | null
          auto_alert_contact_id: string | null
          dosage: string
          frequency: string
          id: string
          last_taken: string | null
          name: string
          notes: string | null
          patient_id: string
          quantity: number
          times: string[]
          type: string
          unit: string
        }
        Insert: {
          alert_threshold?: number | null
          auto_alert_contact_id?: string | null
          dosage: string
          frequency: string
          id?: string
          last_taken?: string | null
          name: string
          notes?: string | null
          patient_id: string
          quantity: number
          times: string[]
          type: string
          unit: string
        }
        Update: {
          alert_threshold?: number | null
          auto_alert_contact_id?: string | null
          dosage?: string
          frequency?: string
          id?: string
          last_taken?: string | null
          name?: string
          notes?: string | null
          patient_id?: string
          quantity?: number
          times?: string[]
          type?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_medications_auto_alert_contact_id_fkey"
            columns: ["auto_alert_contact_id"]
            isOneToOne: false
            referencedRelation: "patient_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_mood_entries: {
        Row: {
          date: string
          id: string
          mood: string
          notes: string | null
          patient_id: string
        }
        Insert: {
          date?: string
          id?: string
          mood: string
          notes?: string | null
          patient_id: string
        }
        Update: {
          date?: string
          id?: string
          mood?: string
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_mood_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_observations: {
        Row: {
          id: string
          observations: string | null
          patient_id: string
        }
        Insert: {
          id?: string
          observations?: string | null
          patient_id: string
        }
        Update: {
          id?: string
          observations?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_observations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: string | null
          blood_type: string | null
          caregiver_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          password: boolean | null
          updated_at: string
        }
        Insert: {
          age?: string | null
          blood_type?: string | null
          caregiver_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          password?: boolean | null
          updated_at?: string
        }
        Update: {
          age?: string | null
          blood_type?: string | null
          caregiver_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          password?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          two_factor_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          two_factor_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
