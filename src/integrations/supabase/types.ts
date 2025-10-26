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
      agt_submissions: {
        Row: {
          agt_response: Json | null
          attempts: number
          confirmed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          invoice_id: number | null
          organization_id: string
          payload: Json
          signature: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          agt_response?: Json | null
          attempts?: number
          confirmed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          invoice_id?: number | null
          organization_id: string
          payload: Json
          signature?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          agt_response?: Json | null
          attempts?: number
          confirmed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          invoice_id?: number | null
          organization_id?: string
          payload?: Json
          signature?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agt_submissions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agt_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          execution_time: number | null
          id: number
          input_data: Json | null
          ip_address: unknown
          method: string
          organization_id: string | null
          status_code: number
          updated_at: string | null
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          execution_time?: number | null
          id?: number
          input_data?: Json | null
          ip_address: unknown
          method: string
          organization_id?: string | null
          status_code: number
          updated_at?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          execution_time?: number | null
          id?: number
          input_data?: Json | null
          ip_address?: unknown
          method?: string
          organization_id?: string | null
          status_code?: number
          updated_at?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          is_headquarters: boolean
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cache: {
        Row: {
          expiration: number
          key: string
          value: string
        }
        Insert: {
          expiration: number
          key: string
          value: string
        }
        Update: {
          expiration?: number
          key?: string
          value?: string
        }
        Relationships: []
      }
      cache_locks: {
        Row: {
          expiration: number
          key: string
          owner: string
        }
        Insert: {
          expiration: number
          key: string
          owner: string
        }
        Update: {
          expiration?: number
          key?: string
          owner?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          attributes: Json | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          icon: string | null
          id: number
          image: string | null
          is_active: boolean
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          name: string
          parent_id: number | null
          slug: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          image?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          name: string
          parent_id?: number | null
          slug: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          image?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: number | null
          slug?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_foreign"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          billing_address: Json | null
          city: string | null
          company: string | null
          company_id: number | null
          country: string
          created_at: string | null
          credit_limit: number
          custom_fields: Json | null
          deleted_at: string | null
          document: string | null
          document_type: string | null
          email: string
          id: number
          id_number: string | null
          industry: string | null
          is_active: boolean
          mobile: string | null
          name: string
          notes: string | null
          organization_id: string | null
          payment_terms: number
          phone: string | null
          shipping_address: Json | null
          state: string | null
          status: string
          tax_number: string | null
          type: string
          updated_at: string | null
          user_id: number
          uuid: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          billing_address?: Json | null
          city?: string | null
          company?: string | null
          company_id?: number | null
          country?: string
          created_at?: string | null
          credit_limit?: number
          custom_fields?: Json | null
          deleted_at?: string | null
          document?: string | null
          document_type?: string | null
          email: string
          id?: number
          id_number?: string | null
          industry?: string | null
          is_active?: boolean
          mobile?: string | null
          name: string
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number
          phone?: string | null
          shipping_address?: Json | null
          state?: string | null
          status?: string
          tax_number?: string | null
          type?: string
          updated_at?: string | null
          user_id: number
          uuid?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          billing_address?: Json | null
          city?: string | null
          company?: string | null
          company_id?: number | null
          country?: string
          created_at?: string | null
          credit_limit?: number
          custom_fields?: Json | null
          deleted_at?: string | null
          document?: string | null
          document_type?: string | null
          email?: string
          id?: number
          id_number?: string | null
          industry?: string | null
          is_active?: boolean
          mobile?: string | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          payment_terms?: number
          phone?: string | null
          shipping_address?: Json | null
          state?: string | null
          status?: string
          tax_number?: string | null
          type?: string
          updated_at?: string | null
          user_id?: number
          uuid?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_foreign"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: Json | null
          bank_details: Json | null
          billing_address: Json | null
          created_at: string | null
          deleted_at: string | null
          email: string
          id: number
          industry: string | null
          logo: string | null
          mobile: string | null
          name: string
          phone: string | null
          settings: Json | null
          status: string
          tax_number: string
          trading_name: string | null
          updated_at: string | null
          uuid: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          bank_details?: Json | null
          billing_address?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id?: number
          industry?: string | null
          logo?: string | null
          mobile?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          status?: string
          tax_number: string
          trading_name?: string | null
          updated_at?: string | null
          uuid: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          bank_details?: Json | null
          billing_address?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: number
          industry?: string | null
          logo?: string | null
          mobile?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          status?: string
          tax_number?: string
          trading_name?: string | null
          updated_at?: string | null
          uuid?: string
          website?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          annual_revenue: number | null
          city: string | null
          contact_person: string | null
          country: string
          created_at: string | null
          credit_limit: number
          custom_fields: Json | null
          deleted_at: string | null
          discount_percentage: number
          email: string
          employee_count: string | null
          id: number
          industry: string | null
          last_purchase_at: string | null
          name: string
          notes: string | null
          payment_terms: number
          phone: string | null
          postal_code: string | null
          preferred_payment_method: string
          state: string | null
          status: string
          tags: Json | null
          tax_number: string | null
          total_orders: number
          total_purchases: number
          type: string
          updated_at: string | null
          user_id: number
          website: string | null
        }
        Insert: {
          address?: string | null
          annual_revenue?: number | null
          city?: string | null
          contact_person?: string | null
          country?: string
          created_at?: string | null
          credit_limit?: number
          custom_fields?: Json | null
          deleted_at?: string | null
          discount_percentage?: number
          email: string
          employee_count?: string | null
          id?: number
          industry?: string | null
          last_purchase_at?: string | null
          name: string
          notes?: string | null
          payment_terms?: number
          phone?: string | null
          postal_code?: string | null
          preferred_payment_method?: string
          state?: string | null
          status?: string
          tags?: Json | null
          tax_number?: string | null
          total_orders?: number
          total_purchases?: number
          type?: string
          updated_at?: string | null
          user_id: number
          website?: string | null
        }
        Update: {
          address?: string | null
          annual_revenue?: number | null
          city?: string | null
          contact_person?: string | null
          country?: string
          created_at?: string | null
          credit_limit?: number
          custom_fields?: Json | null
          deleted_at?: string | null
          discount_percentage?: number
          email?: string
          employee_count?: string | null
          id?: number
          industry?: string | null
          last_purchase_at?: string | null
          name?: string
          notes?: string | null
          payment_terms?: number
          phone?: string | null
          postal_code?: string | null
          preferred_payment_method?: string
          state?: string | null
          status?: string
          tags?: Json | null
          tax_number?: string | null
          total_orders?: number
          total_purchases?: number
          type?: string
          updated_at?: string | null
          user_id?: number
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_jobs: {
        Row: {
          connection: string
          exception: string
          failed_at: string
          id: number
          payload: string
          queue: string
          uuid: string
        }
        Insert: {
          connection: string
          exception: string
          failed_at?: string
          id?: number
          payload: string
          queue: string
          uuid: string
        }
        Update: {
          connection?: string
          exception?: string
          failed_at?: string
          id?: number
          payload?: string
          queue?: string
          uuid?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number
          discount_rate: number
          id: number
          invoice_id: number
          metadata: Json | null
          product_id: number | null
          quantity: number
          sort_order: number
          tax_amount: number
          tax_rate: number
          total_price: number
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number
          discount_rate?: number
          id?: number
          invoice_id: number
          metadata?: Json | null
          product_id?: number | null
          quantity: number
          sort_order?: number
          tax_amount?: number
          tax_rate?: number
          total_price: number
          unit?: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number
          discount_rate?: number
          id?: number
          invoice_id?: number
          metadata?: Json | null
          product_id?: number | null
          quantity?: number
          sort_order?: number
          tax_amount?: number
          tax_rate?: number
          total_price?: number
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_foreign"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_foreign"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          billing_address: Json | null
          branch_id: string | null
          client_id: number
          created_at: string | null
          currency: string
          deleted_at: string | null
          discount_amount: number
          due_date: string
          id: number
          invoice_number: string
          is_recurring: boolean
          issue_date: string
          next_recurring_date: string | null
          notes: string | null
          organization_id: string | null
          paid_amount: number
          paid_date: string | null
          payment_method: string | null
          pdf_path: string | null
          recurring_frequency: string | null
          shipping_address: Json | null
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          total_amount: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          billing_address?: Json | null
          branch_id?: string | null
          client_id: number
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          due_date: string
          id?: number
          invoice_number: string
          is_recurring?: boolean
          issue_date: string
          next_recurring_date?: string | null
          notes?: string | null
          organization_id?: string | null
          paid_amount?: number
          paid_date?: string | null
          payment_method?: string | null
          pdf_path?: string | null
          recurring_frequency?: string | null
          shipping_address?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          billing_address?: Json | null
          branch_id?: string | null
          client_id?: number
          created_at?: string | null
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          due_date?: string
          id?: number
          invoice_number?: string
          is_recurring?: boolean
          issue_date?: string
          next_recurring_date?: string | null
          notes?: string | null
          organization_id?: string | null
          paid_amount?: number
          paid_date?: string | null
          payment_method?: string | null
          pdf_path?: string | null
          recurring_frequency?: string | null
          shipping_address?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_foreign"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          attempts: number
          available_at: number
          created_at: number
          id: number
          payload: string
          queue: string
          reserved_at: number | null
        }
        Insert: {
          attempts: number
          available_at: number
          created_at: number
          id?: number
          payload: string
          queue: string
          reserved_at?: number | null
        }
        Update: {
          attempts?: number
          available_at?: number
          created_at?: number
          id?: number
          payload?: string
          queue?: string
          reserved_at?: number | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          batch: number
          id: number
          migration: string
        }
        Insert: {
          batch: number
          id?: number
          migration: string
        }
        Update: {
          batch?: number
          id?: number
          migration?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: string
          id: string
          notifiable_id: number
          notifiable_type: string
          read_at: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          id: string
          notifiable_id: number
          notifiable_type: string
          read_at?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          id?: string
          notifiable_id?: number
          notifiable_type?: string
          read_at?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      organization_modules: {
        Row: {
          config: Json | null
          created_at: string
          disabled_at: string | null
          enabled_at: string | null
          id: string
          is_enabled: boolean
          module_key: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          disabled_at?: string | null
          enabled_at?: string | null
          id?: string
          is_enabled?: boolean
          module_key: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          disabled_at?: string | null
          enabled_at?: string | null
          id?: string
          is_enabled?: boolean
          module_key?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_modules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          nif: string | null
          phone: string | null
          subscription_plan_id: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          nif?: string | null
          phone?: string | null
          subscription_plan_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          nif?: string | null
          phone?: string | null
          subscription_plan_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: number
          created_at: string | null
          currency: string
          fee_amount: number
          gateway: string | null
          gateway_response: Json | null
          id: number
          invoice_id: number
          net_amount: number
          notes: string | null
          organization_id: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          processed_at: string | null
          receipt_path: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          amount: number
          client_id: number
          created_at?: string | null
          currency?: string
          fee_amount?: number
          gateway?: string | null
          gateway_response?: Json | null
          id?: number
          invoice_id: number
          net_amount: number
          notes?: string | null
          organization_id?: string | null
          payment_date: string
          payment_method?: string
          payment_number: string
          processed_at?: string | null
          receipt_path?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          amount?: number
          client_id?: number
          created_at?: string | null
          currency?: string
          fee_amount?: number
          gateway?: string | null
          gateway_response?: Json | null
          id?: number
          invoice_id?: number
          net_amount?: number
          notes?: string | null
          organization_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          processed_at?: string | null
          receipt_path?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_foreign"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_foreign"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_access_tokens: {
        Row: {
          abilities: string | null
          created_at: string | null
          expires_at: string | null
          id: number
          last_used_at: string | null
          name: string
          token: string
          tokenable_id: number
          tokenable_type: string
          updated_at: string | null
        }
        Insert: {
          abilities?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          name: string
          token: string
          tokenable_id: number
          tokenable_type: string
          updated_at?: string | null
        }
        Update: {
          abilities?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          last_used_at?: string | null
          name?: string
          token?: string
          tokenable_id?: number
          tokenable_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string | null
          category_id: string | null
          company_id: number | null
          cost: number | null
          created_at: string | null
          custom_fields: Json | null
          deleted_at: string | null
          description: string | null
          dimensions: Json | null
          id: number
          images: Json | null
          is_active: boolean
          max_stock: number | null
          min_stock: number
          name: string
          organization_id: string | null
          price: number
          sku: string | null
          status: string
          stock_quantity: number
          tax_rate: number
          track_stock: boolean
          type: string
          unit: string
          updated_at: string | null
          user_id: number
          uuid: string | null
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          company_id?: number | null
          cost?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: number
          images?: Json | null
          is_active?: boolean
          max_stock?: number | null
          min_stock?: number
          name: string
          organization_id?: string | null
          price: number
          sku?: string | null
          status?: string
          stock_quantity?: number
          tax_rate?: number
          track_stock?: boolean
          type?: string
          unit?: string
          updated_at?: string | null
          user_id: number
          uuid?: string | null
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          category_id?: string | null
          company_id?: number | null
          cost?: number | null
          created_at?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          description?: string | null
          dimensions?: Json | null
          id?: number
          images?: Json | null
          is_active?: boolean
          max_stock?: number | null
          min_stock?: number
          name?: string
          organization_id?: string | null
          price?: number
          sku?: string | null
          status?: string
          stock_quantity?: number
          tax_rate?: number
          track_stock?: boolean
          type?: string
          unit?: string
          updated_at?: string | null
          user_id?: number
          uuid?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_foreign"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_organization_id: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_organization_id?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_organization_id?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string | null
          description: string
          discount_amount: number
          discount_rate: number
          id: number
          product_id: number | null
          quantity: number
          quote_id: number
          sort_order: number
          tax_amount: number
          tax_rate: number
          total_price: number
          unit: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          discount_amount?: number
          discount_rate?: number
          id?: number
          product_id?: number | null
          quantity: number
          quote_id: number
          sort_order?: number
          tax_amount?: number
          tax_rate?: number
          total_price: number
          unit?: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          discount_amount?: number
          discount_rate?: number
          id?: number
          product_id?: number | null
          quantity?: number
          quote_id?: number
          sort_order?: number
          tax_amount?: number
          tax_rate?: number
          total_price?: number
          unit?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_id_foreign"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_foreign"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_date: string | null
          billing_address: Json | null
          client_id: number
          converted_invoice_id: number | null
          created_at: string | null
          currency: string
          discount_amount: number
          expiry_date: string
          id: number
          issue_date: string
          notes: string | null
          pdf_path: string | null
          quote_number: string
          shipping_address: Json | null
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          total_amount: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          accepted_date?: string | null
          billing_address?: Json | null
          client_id: number
          converted_invoice_id?: number | null
          created_at?: string | null
          currency?: string
          discount_amount?: number
          expiry_date: string
          id?: number
          issue_date: string
          notes?: string | null
          pdf_path?: string | null
          quote_number: string
          shipping_address?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          accepted_date?: string | null
          billing_address?: Json | null
          client_id?: number
          converted_invoice_id?: number | null
          created_at?: string | null
          currency?: string
          discount_amount?: number
          expiry_date?: string
          id?: number
          issue_date?: string
          notes?: string | null
          pdf_path?: string | null
          quote_number?: string
          shipping_address?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_foreign"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_converted_invoice_id_foreign"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          id: string
          ip_address: string | null
          last_activity: number
          payload: string
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          id: string
          ip_address?: string | null
          last_activity: number
          payload: string
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          last_activity?: number
          payload?: string
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          group: string
          id: number
          is_public: boolean
          key: string
          type: string
          updated_at: string | null
          user_id: number | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          group?: string
          id?: number
          is_public?: boolean
          key: string
          type?: string
          updated_at?: string | null
          user_id?: number | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          group?: string
          id?: number
          is_public?: boolean
          key?: string
          type?: string
          updated_at?: string | null
          user_id?: number | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          max_branches: number
          max_invoices_per_month: number
          max_users: number
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_branches?: number
          max_invoices_per_month?: number
          max_users?: number
          name: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          max_branches?: number
          max_invoices_per_month?: number
          max_users?: number
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: number
          name: string
          nif: string | null
          notes: string | null
          phone: string | null
          rating: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: number
          name: string
          nif?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          address?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: number
          name?: string
          nif?: string | null
          notes?: string | null
          phone?: string | null
          rating?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_user_id_foreign"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          avatar: string | null
          city: string | null
          company_name: string | null
          country: string
          created_at: string | null
          email: string
          email_verified_at: string | null
          id: number
          is_active: boolean
          name: string
          password: string
          phone: string | null
          preferences: Json | null
          remember_token: string | null
          role: string
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          id?: number
          is_active?: boolean
          name: string
          password: string
          phone?: string | null
          preferences?: Json | null
          remember_token?: string | null
          role?: string
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          id?: number
          is_active?: boolean
          name?: string
          password?: string
          phone?: string | null
          preferences?: Json | null
          remember_token?: string | null
          role?: string
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organizations: {
        Args: { _user_id: string }
        Returns: {
          organization_id: string
        }[]
      }
      has_module_access: {
        Args: { _module_key: string; _org_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_in_organization: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "manager" | "accountant" | "operator"
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
      app_role: ["super_admin", "admin", "manager", "accountant", "operator"],
    },
  },
} as const
