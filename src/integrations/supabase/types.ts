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
