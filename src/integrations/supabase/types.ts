export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          clinic_id: string
          created_at: string | null
          created_by: string | null
          doctor_id: string
          duration: number | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          treatment: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          clinic_id: string
          created_at?: string | null
          created_by?: string | null
          doctor_id: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          treatment?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          clinic_id?: string
          created_at?: string | null
          created_by?: string | null
          doctor_id?: string
          duration?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          treatment?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_staff: {
        Row: {
          clinic_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_staff_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          name_ar: string
          online_booking_enabled: boolean | null
          owner_id: string
          phone: string | null
          updated_at: string | null
          working_hours: Json | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          name_ar: string
          online_booking_enabled?: boolean | null
          owner_id: string
          phone?: string | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          name_ar?: string
          online_booking_enabled?: boolean | null
          owner_id?: string
          phone?: string | null
          updated_at?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          clinic_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          clinic_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          clinic_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          clinic_id: string
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          id: string
          medical_history: Json | null
          name: string
          notes: string | null
          phone: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          clinic_id: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          medical_history?: Json | null
          name: string
          notes?: string | null
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          clinic_id?: string
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          id?: string
          medical_history?: Json | null
          name?: string
          notes?: string | null
          phone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_reminders: {
        Row: {
          clinic_id: string
          created_at: string | null
          description: string | null
          id: string
          related_id: string | null
          reminder_time: string
          reminder_type: string | null
          staff_id: string
          status: string | null
          title: string
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          reminder_time: string
          reminder_type?: string | null
          staff_id: string
          status?: string | null
          title: string
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          related_id?: string | null
          reminder_time?: string
          reminder_type?: string | null
          staff_id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_reminders_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_tasks: {
        Row: {
          clinic_id: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          from_staff_id: string
          id: string
          priority: string | null
          status: string | null
          title: string
          to_staff_id: string
          updated_at: string | null
        }
        Insert: {
          clinic_id: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          from_staff_id: string
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          to_staff_id: string
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          from_staff_id?: string
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          to_staff_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_tasks_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_clinic_owner: {
        Args: { _clinic_id: string; _user_id: string }
        Returns: boolean
      }
      is_clinic_staff: {
        Args: { _clinic_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "platform_admin"
        | "dentist"
        | "clinic_manager"
        | "nurse"
        | "assistant"
        | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "platform_admin",
        "dentist",
        "clinic_manager",
        "nurse",
        "assistant",
        "receptionist",
      ],
    },
  },
} as const
