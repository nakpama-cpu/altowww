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
      approval_tokens: {
        Row: {
          action: string
          created_at: string
          expires_at: string
          id: string
          profile_id: string
          token: string
          used_at: string | null
        }
        Insert: {
          action: string
          created_at?: string
          expires_at?: string
          id?: string
          profile_id: string
          token: string
          used_at?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          expires_at?: string
          id?: string
          profile_id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      discount_code_clients: {
        Row: {
          code_id: string
          created_at: string
          id: string
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          code_id: string
          created_at?: string
          id?: string
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          code_id?: string
          created_at?: string
          id?: string
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_code_clients_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          notes: string | null
          percent: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          percent: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          notes?: string | null
          percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      distilleries: {
        Row: {
          about: string | null
          annual_production: string | null
          awards: Json
          country: string | null
          created_at: string
          export_markets: string | null
          famous_for: string | null
          founded_by: string | null
          founded_year: number | null
          id: string
          image_url: string | null
          logo_url: string | null
          name: string
          news: Json
          owner: string | null
          region: string | null
          region_character: string | null
          visitor_centre: string | null
          website_url: string | null
        }
        Insert: {
          about?: string | null
          annual_production?: string | null
          awards?: Json
          country?: string | null
          created_at?: string
          export_markets?: string | null
          famous_for?: string | null
          founded_by?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name: string
          news?: Json
          owner?: string | null
          region?: string | null
          region_character?: string | null
          visitor_centre?: string | null
          website_url?: string | null
        }
        Update: {
          about?: string | null
          annual_production?: string | null
          awards?: Json
          country?: string | null
          created_at?: string
          export_markets?: string | null
          famous_for?: string | null
          founded_by?: string | null
          founded_year?: number | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          name?: string
          news?: Json
          owner?: string | null
          region?: string | null
          region_character?: string | null
          visitor_centre?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
          discount_code: string | null
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
          discount_code?: string | null
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
          discount_code?: string | null
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
          country: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string
          phone_country_code: string | null
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
        }
        Insert: {
          client_discount_pct?: number
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id: string
          last_name?: string
          notes?: string | null
          phone?: string
          phone_country_code?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Update: {
          client_discount_pct?: number
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          phone_country_code?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      validate_discount_code: { Args: { _code: string }; Returns: Json }
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
