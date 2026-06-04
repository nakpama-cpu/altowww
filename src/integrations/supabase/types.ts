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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      callback_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          reason: string | null
          requester_id: string
          status: Database["public"]["Enums"]["callback_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          reason?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["callback_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          reason?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["callback_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "callback_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      casks: {
        Row: {
          abv: number | null
          age_years: number | null
          cask_number: string
          cask_type: string | null
          created_at: string
          currency: string
          description: string | null
          distillery_id: string | null
          fill_date: string | null
          hero_image_url: string | null
          id: string
          list_price: number | null
          ola_litres: number | null
          rla_litres: number | null
          spirit: string
          status: Database["public"]["Enums"]["cask_status"]
          updated_at: string
        }
        Insert: {
          abv?: number | null
          age_years?: number | null
          cask_number: string
          cask_type?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          distillery_id?: string | null
          fill_date?: string | null
          hero_image_url?: string | null
          id?: string
          list_price?: number | null
          ola_litres?: number | null
          rla_litres?: number | null
          spirit?: string
          status?: Database["public"]["Enums"]["cask_status"]
          updated_at?: string
        }
        Update: {
          abv?: number | null
          age_years?: number | null
          cask_number?: string
          cask_type?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          distillery_id?: string | null
          fill_date?: string | null
          hero_image_url?: string | null
          id?: string
          list_price?: number | null
          ola_litres?: number | null
          rla_litres?: number | null
          spirit?: string
          status?: Database["public"]["Enums"]["cask_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "casks_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
        ]
      }
      distilleries: {
        Row: {
          about: string | null
          awards: string | null
          country: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          region: string | null
        }
        Insert: {
          about?: string | null
          awards?: string | null
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          region?: string | null
        }
        Update: {
          about?: string | null
          awards?: string | null
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      holdings: {
        Row: {
          cask_id: string
          certificate_path: string | null
          created_at: string
          id: string
          notes: string | null
          owner_id: string
          purchase_date: string
          purchase_price: number
          updated_at: string
        }
        Insert: {
          cask_id: string
          certificate_path?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id: string
          purchase_date?: string
          purchase_price: number
          updated_at?: string
        }
        Update: {
          cask_id?: string
          certificate_path?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string
          purchase_date?: string
          purchase_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "holdings_cask_id_fkey"
            columns: ["cask_id"]
            isOneToOne: true
            referencedRelation: "casks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holdings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string | null
          phone: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message?: string | null
          phone: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string | null
          phone?: string
          source?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          buyer_id: string
          cask_id: string
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          cask_id: string
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          cask_id?: string
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_cask_id_fkey"
            columns: ["cask_id"]
            isOneToOne: false
            referencedRelation: "casks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          client_discount_pct: number
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          client_discount_pct?: number
          created_at?: string
          email?: string
          first_name?: string
          id: string
          last_name?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          client_discount_pct?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      is_approved: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "client"
      callback_status: "new" | "contacted" | "closed"
      cask_status: "available" | "reserved" | "held" | "sold"
      order_status: "pending" | "paid" | "cancelled" | "refunded"
      profile_status: "pending" | "approved" | "suspended"
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
      app_role: ["admin", "client"],
      callback_status: ["new", "contacted", "closed"],
      cask_status: ["available", "reserved", "held", "sold"],
      order_status: ["pending", "paid", "cancelled", "refunded"],
      profile_status: ["pending", "approved", "suspended"],
    },
  },
} as const
