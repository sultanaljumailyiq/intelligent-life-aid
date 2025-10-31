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
      booking_requests: {
        Row: {
          alternative_dates: Json | null
          clinic_id: string
          confirmed_appointment_id: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          id: string
          message: string | null
          patient_email: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time: string
          rejection_reason: string | null
          status: string | null
          treatment_type: string | null
          updated_at: string | null
        }
        Insert: {
          alternative_dates?: Json | null
          clinic_id: string
          confirmed_appointment_id?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          patient_email?: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time: string
          rejection_reason?: string | null
          status?: string | null
          treatment_type?: string | null
          updated_at?: string | null
        }
        Update: {
          alternative_dates?: Json | null
          clinic_id?: string
          confirmed_appointment_id?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          patient_email?: string | null
          patient_name?: string
          patient_phone?: string
          preferred_date?: string
          preferred_time?: string
          rejection_reason?: string | null
          status?: string | null
          treatment_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_confirmed_appointment_id_fkey"
            columns: ["confirmed_appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          arabic_description: string | null
          arabic_name: string | null
          country_of_origin: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          slug: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          arabic_description?: string | null
          arabic_name?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          slug: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          arabic_description?: string | null
          arabic_name?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      cart: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          arabic_description: string | null
          arabic_name: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          arabic_description?: string | null
          arabic_name: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          arabic_description?: string | null
          arabic_name?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_reviews: {
        Row: {
          clinic_id: string
          comment: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          rating: number
          recommend: boolean | null
          title: string | null
          treatment_received: string | null
          updated_at: string | null
          user_id: string
          visit_date: string | null
        }
        Insert: {
          clinic_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          rating: number
          recommend?: boolean | null
          title?: string | null
          treatment_received?: string | null
          updated_at?: string | null
          user_id: string
          visit_date?: string | null
        }
        Update: {
          clinic_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          rating?: number
          recommend?: boolean | null
          title?: string | null
          treatment_received?: string | null
          updated_at?: string | null
          user_id?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinic_reviews_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
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
      commission_settings: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          is_active: boolean | null
          min_commission: number | null
          notes: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_commission?: number | null
          notes?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_commission?: number | null
          notes?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_settings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: true
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_courses: {
        Row: {
          arabic_description: string | null
          arabic_title: string
          category: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: string | null
          end_date: string | null
          enrollment_count: number | null
          id: string
          instructor: string
          is_active: boolean | null
          is_featured: boolean | null
          level: string | null
          price: number | null
          rating: number | null
          review_count: number | null
          start_date: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          arabic_description?: string | null
          arabic_title: string
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          enrollment_count?: number | null
          id?: string
          instructor: string
          is_active?: boolean | null
          is_featured?: boolean | null
          level?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          start_date?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          arabic_description?: string | null
          arabic_title?: string
          category?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: string | null
          end_date?: string | null
          enrollment_count?: number | null
          id?: string
          instructor?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          level?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          start_date?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_educational_content: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          arabic_content: string
          arabic_title: string
          author_id: string
          category: string | null
          comment_count: number | null
          content: string
          content_type: string | null
          cover_image: string | null
          created_at: string | null
          id: string
          images: Json | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          published_at: string | null
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          arabic_content: string
          arabic_title: string
          author_id: string
          category?: string | null
          comment_count?: number | null
          content: string
          content_type?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          published_at?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          arabic_content?: string
          arabic_title?: string
          author_id?: string
          category?: string | null
          comment_count?: number | null
          content?: string
          content_type?: string | null
          cover_image?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          published_at?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      community_events: {
        Row: {
          arabic_description: string | null
          arabic_title: string
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          current_attendees: number | null
          description: string | null
          duration: number | null
          end_date: string
          event_type: string | null
          external_url: string | null
          id: string
          is_external: boolean | null
          is_free: boolean | null
          max_attendees: number | null
          meeting_link: string | null
          price: number | null
          speaker_bio: string | null
          speaker_image: string | null
          speaker_name: string | null
          start_date: string
          status: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          arabic_description?: string | null
          arabic_title: string
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          current_attendees?: number | null
          description?: string | null
          duration?: number | null
          end_date: string
          event_type?: string | null
          external_url?: string | null
          id?: string
          is_external?: boolean | null
          is_free?: boolean | null
          max_attendees?: number | null
          meeting_link?: string | null
          price?: number | null
          speaker_bio?: string | null
          speaker_image?: string | null
          speaker_name?: string | null
          start_date: string
          status?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          arabic_description?: string | null
          arabic_title?: string
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          current_attendees?: number | null
          description?: string | null
          duration?: number | null
          end_date?: string
          event_type?: string | null
          external_url?: string | null
          id?: string
          is_external?: boolean | null
          is_free?: boolean | null
          max_attendees?: number | null
          meeting_link?: string | null
          price?: number | null
          speaker_bio?: string | null
          speaker_image?: string | null
          speaker_name?: string | null
          start_date?: string
          status?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          author_id: string
          comment_count: number | null
          content: string
          created_at: string | null
          id: string
          images: Json | null
          is_approved: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          post_type: string | null
          share_count: number | null
          updated_at: string | null
          view_count: number | null
          visibility: string | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          post_type?: string | null
          share_count?: number | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          post_type?: string | null
          share_count?: number | null
          updated_at?: string | null
          view_count?: number | null
          visibility?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      iraqi_provinces: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name_ar: string
          name_en: string
          region: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar: string
          name_en: string
          region?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_ar?: string
          name_en?: string
          region?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          notes: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          notes?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_count: number | null
          application_deadline: string | null
          arabic_description: string
          arabic_title: string
          benefits: Json | null
          clinic_id: string | null
          created_at: string | null
          description: string
          employer_id: string | null
          experience_required: number | null
          governorate: string | null
          id: string
          is_featured: boolean | null
          job_type: string
          location: string | null
          qualifications: Json | null
          requirements: Json | null
          salary_max: number | null
          salary_min: number | null
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          application_count?: number | null
          application_deadline?: string | null
          arabic_description: string
          arabic_title: string
          benefits?: Json | null
          clinic_id?: string | null
          created_at?: string | null
          description: string
          employer_id?: string | null
          experience_required?: number | null
          governorate?: string | null
          id?: string
          is_featured?: boolean | null
          job_type: string
          location?: string | null
          qualifications?: Json | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          application_count?: number | null
          application_deadline?: string | null
          arabic_description?: string
          arabic_title?: string
          benefits?: Json | null
          clinic_id?: string | null
          created_at?: string | null
          description?: string
          employer_id?: string | null
          experience_required?: number | null
          governorate?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: string
          location?: string | null
          qualifications?: Json | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_orders: {
        Row: {
          actual_cost: number | null
          attachments: Json | null
          clinic_id: string
          completed_date: string | null
          created_at: string | null
          delivered_date: string | null
          description: string | null
          estimated_cost: number | null
          expected_date: string | null
          id: string
          lab_id: string
          notes: string | null
          order_number: string
          order_type: string
          ordered_date: string
          patient_id: string
          rush_order: boolean | null
          specifications: Json | null
          status: string | null
          treatment_plan_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          attachments?: Json | null
          clinic_id: string
          completed_date?: string | null
          created_at?: string | null
          delivered_date?: string | null
          description?: string | null
          estimated_cost?: number | null
          expected_date?: string | null
          id?: string
          lab_id: string
          notes?: string | null
          order_number: string
          order_type: string
          ordered_date: string
          patient_id: string
          rush_order?: boolean | null
          specifications?: Json | null
          status?: string | null
          treatment_plan_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          attachments?: Json | null
          clinic_id?: string
          completed_date?: string | null
          created_at?: string | null
          delivered_date?: string | null
          description?: string | null
          estimated_cost?: number | null
          expected_date?: string | null
          id?: string
          lab_id?: string
          notes?: string | null
          order_number?: string
          order_type?: string
          ordered_date?: string
          patient_id?: string
          rush_order?: boolean | null
          specifications?: Json | null
          status?: string | null
          treatment_plan_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_lab_id_fkey"
            columns: ["lab_id"]
            isOneToOne: false
            referencedRelation: "labs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      labs: {
        Row: {
          address: string
          arabic_description: string | null
          arabic_name: string
          city: string
          created_at: string | null
          description: string | null
          email: string | null
          governorate: string
          id: string
          images: Json | null
          is_active: boolean | null
          is_verified: boolean | null
          location_lat: number | null
          location_lng: number | null
          logo: string | null
          name: string
          phone: string
          rating: number | null
          review_count: number | null
          services: Json | null
          specializations: Json | null
          updated_at: string | null
          user_id: string | null
          working_hours: Json | null
        }
        Insert: {
          address: string
          arabic_description?: string | null
          arabic_name: string
          city: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          governorate: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          logo?: string | null
          name: string
          phone: string
          rating?: number | null
          review_count?: number | null
          services?: Json | null
          specializations?: Json | null
          updated_at?: string | null
          user_id?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string
          arabic_description?: string | null
          arabic_name?: string
          city?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          governorate?: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          logo?: string | null
          name?: string
          phone?: string
          rating?: number | null
          review_count?: number | null
          services?: Json | null
          specializations?: Json | null
          updated_at?: string | null
          user_id?: string | null
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
      order_items: {
        Row: {
          commission_amount: number | null
          commission_rate: number | null
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_arabic_name: string | null
          product_id: string
          product_image: string | null
          product_name: string
          quantity: number
          sku: string | null
          status: string | null
          subtotal: number
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_arabic_name?: string | null
          product_id: string
          product_image?: string | null
          product_name: string
          quantity: number
          sku?: string | null
          status?: string | null
          subtotal: number
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_arabic_name?: string | null
          product_id?: string
          product_image?: string | null
          product_name?: string
          quantity?: number
          sku?: string | null
          status?: string | null
          subtotal?: number
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_returns: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          description: string | null
          id: string
          images: Json | null
          notes: string | null
          order_id: string
          order_item_id: string | null
          quantity: number
          reason: string
          reason_arabic: string | null
          refund_amount: number
          refund_method: string | null
          refunded_at: string | null
          rejection_reason: string | null
          return_number: string
          status: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          description?: string | null
          id?: string
          images?: Json | null
          notes?: string | null
          order_id: string
          order_item_id?: string | null
          quantity: number
          reason: string
          reason_arabic?: string | null
          refund_amount: number
          refund_method?: string | null
          refunded_at?: string | null
          rejection_reason?: string | null
          return_number: string
          status?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          description?: string | null
          id?: string
          images?: Json | null
          notes?: string | null
          order_id?: string
          order_item_id?: string | null
          quantity?: number
          reason?: string
          reason_arabic?: string | null
          refund_amount?: number
          refund_method?: string | null
          refunded_at?: string | null
          rejection_reason?: string | null
          return_number?: string
          status?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          customer_id: string
          delivered_at: string | null
          discount: number | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string
          shipping_address: Json
          shipping_cost: number | null
          status: string
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id: string
          delivered_at?: string | null
          discount?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string
          shipping_address: Json
          shipping_cost?: number | null
          status?: string
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id?: string
          delivered_at?: string | null
          discount?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json
          shipping_cost?: number | null
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_medical_records: {
        Row: {
          clinic_id: string
          created_at: string | null
          description: string | null
          documents: Json | null
          findings: string | null
          id: string
          images: Json | null
          patient_id: string
          record_date: string
          record_type: string
          recorded_by: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          findings?: string | null
          id?: string
          images?: Json | null
          patient_id: string
          record_date: string
          record_type: string
          recorded_by?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string | null
          description?: string | null
          documents?: Json | null
          findings?: string | null
          id?: string
          images?: Json | null
          patient_id?: string
          record_date?: string
          record_type?: string
          recorded_by?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_medical_records_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      products: {
        Row: {
          arabic_description: string | null
          arabic_features: Json | null
          arabic_name: string
          arabic_specifications: Json | null
          arabic_tags: Json | null
          barcode: string | null
          brand_id: string | null
          category_id: string
          certification: Json | null
          country_of_origin: string | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          discount: number | null
          estimated_days: string | null
          features: Json | null
          free_shipping: boolean | null
          id: string
          image: string
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          max_order_quantity: number | null
          min_order_quantity: number | null
          name: string
          order_count: number | null
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          sku: string
          slug: string
          specifications: Json | null
          stock_quantity: number | null
          supplier_id: string
          tags: Json | null
          updated_at: string | null
          view_count: number | null
          warranty: string | null
          weight: string | null
        }
        Insert: {
          arabic_description?: string | null
          arabic_features?: Json | null
          arabic_name: string
          arabic_specifications?: Json | null
          arabic_tags?: Json | null
          barcode?: string | null
          brand_id?: string | null
          category_id: string
          certification?: Json | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          discount?: number | null
          estimated_days?: string | null
          features?: Json | null
          free_shipping?: boolean | null
          id?: string
          image: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          name: string
          order_count?: number | null
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          sku: string
          slug: string
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id: string
          tags?: Json | null
          updated_at?: string | null
          view_count?: number | null
          warranty?: string | null
          weight?: string | null
        }
        Update: {
          arabic_description?: string | null
          arabic_features?: Json | null
          arabic_name?: string
          arabic_specifications?: Json | null
          arabic_tags?: Json | null
          barcode?: string | null
          brand_id?: string | null
          category_id?: string
          certification?: Json | null
          country_of_origin?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          discount?: number | null
          estimated_days?: string | null
          features?: Json | null
          free_shipping?: boolean | null
          id?: string
          image?: string
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          max_order_quantity?: number | null
          min_order_quantity?: number | null
          name?: string
          order_count?: number | null
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          sku?: string
          slug?: string
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id?: string
          tags?: Json | null
          updated_at?: string | null
          view_count?: number | null
          warranty?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
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
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          images: Json | null
          is_published: boolean | null
          is_verified: boolean | null
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          is_published?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      subscription_payments: {
        Row: {
          activated_at: string | null
          amount: number
          attachments: Json | null
          clinic_id: string
          created_at: string | null
          deposit_receipt_number: string | null
          duration: number
          exchange_office_name: string | null
          expires_at: string | null
          id: string
          payment_method: string
          payment_number: string
          sender_name: string | null
          status: string | null
          subscription_type: string
          updated_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          zain_cash_phone_number: string | null
          zain_cash_transaction_ref: string | null
        }
        Insert: {
          activated_at?: string | null
          amount: number
          attachments?: Json | null
          clinic_id: string
          created_at?: string | null
          deposit_receipt_number?: string | null
          duration: number
          exchange_office_name?: string | null
          expires_at?: string | null
          id?: string
          payment_method: string
          payment_number: string
          sender_name?: string | null
          status?: string | null
          subscription_type: string
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          zain_cash_phone_number?: string | null
          zain_cash_transaction_ref?: string | null
        }
        Update: {
          activated_at?: string | null
          amount?: number
          attachments?: Json | null
          clinic_id?: string
          created_at?: string | null
          deposit_receipt_number?: string | null
          duration?: number
          exchange_office_name?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string
          payment_number?: string
          sender_name?: string | null
          status?: string | null
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          zain_cash_phone_number?: string | null
          zain_cash_transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          orders: number | null
          product_views: number | null
          revenue: number | null
          supplier_id: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          orders?: number | null
          product_views?: number | null
          revenue?: number | null
          supplier_id: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          orders?: number | null
          product_views?: number | null
          revenue?: number | null
          supplier_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_analytics_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_approvals: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          supplier_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          supplier_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_approvals_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_messages: {
        Row: {
          attachments: Json | null
          conversation_id: string
          created_at: string | null
          customer_id: string
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          read_at: string | null
          sender_id: string
          sender_type: string
          supplier_id: string
        }
        Insert: {
          attachments?: Json | null
          conversation_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          read_at?: string | null
          sender_id: string
          sender_type: string
          supplier_id: string
        }
        Update: {
          attachments?: Json | null
          conversation_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          read_at?: string | null
          sender_id?: string
          sender_type?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_messages_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          approval_note: string | null
          approved_at: string | null
          approved_by: string | null
          arabic_company_name: string | null
          arabic_description: string | null
          badges: Json | null
          certifications: Json | null
          company_name: string
          cover_image: string | null
          created_at: string | null
          description: string | null
          email: string | null
          established: number | null
          id: string
          is_approved: boolean | null
          location: string | null
          logo: string | null
          phone: string | null
          province: string | null
          rating: number | null
          response_time: string | null
          services: Json | null
          speciality: string | null
          total_orders: number | null
          total_products: number | null
          total_reviews: number | null
          union_certificate_number: string | null
          union_endorsed: boolean | null
          union_endorsed_at: string | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          approval_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          arabic_company_name?: string | null
          arabic_description?: string | null
          badges?: Json | null
          certifications?: Json | null
          company_name: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established?: number | null
          id?: string
          is_approved?: boolean | null
          location?: string | null
          logo?: string | null
          phone?: string | null
          province?: string | null
          rating?: number | null
          response_time?: string | null
          services?: Json | null
          speciality?: string | null
          total_orders?: number | null
          total_products?: number | null
          total_reviews?: number | null
          union_certificate_number?: string | null
          union_endorsed?: boolean | null
          union_endorsed_at?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          approval_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          arabic_company_name?: string | null
          arabic_description?: string | null
          badges?: Json | null
          certifications?: Json | null
          company_name?: string
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          established?: number | null
          id?: string
          is_approved?: boolean | null
          location?: string | null
          logo?: string | null
          phone?: string | null
          province?: string | null
          rating?: number | null
          response_time?: string | null
          services?: Json | null
          speciality?: string | null
          total_orders?: number | null
          total_products?: number | null
          total_reviews?: number | null
          union_certificate_number?: string | null
          union_endorsed?: boolean | null
          union_endorsed_at?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      treatment_plans: {
        Row: {
          actual_cost: number | null
          attachments: Json | null
          clinic_id: string
          completed_at: string | null
          created_at: string | null
          description: string | null
          diagnosis: string | null
          doctor_id: string
          end_date: string | null
          estimated_cost: number | null
          id: string
          notes: string | null
          patient_id: string
          procedures: Json | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          attachments?: Json | null
          clinic_id: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          diagnosis?: string | null
          doctor_id: string
          end_date?: string | null
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          procedures?: Json | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          attachments?: Json | null
          clinic_id?: string
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          diagnosis?: string | null
          doctor_id?: string
          end_date?: string | null
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          procedures?: Json | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_procedures: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          notes: string | null
          performed_by: string | null
          procedure_code: string | null
          procedure_name: string
          scheduled_date: string | null
          status: string | null
          tooth_number: string | null
          treatment_plan_id: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          procedure_code?: string | null
          procedure_name: string
          scheduled_date?: string | null
          status?: string | null
          tooth_number?: string | null
          treatment_plan_id: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          performed_by?: string | null
          procedure_code?: string | null
          procedure_name?: string
          scheduled_date?: string | null
          status?: string | null
          tooth_number?: string | null
          treatment_plan_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_procedures_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
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
