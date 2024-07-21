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
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          unit_count: number
          word_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          unit_count?: number
          word_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          unit_count?: number
          word_count?: number
        }
        Relationships: []
      }
      units: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order: number
          title: string
          word_count: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order: number
          title: string
          word_count?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order?: number
          title?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_courses: {
        Row: {
          course_id: string
          created_at: string
          enrolled_at: string
          progress: number
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          enrolled_at?: string
          progress?: number
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          enrolled_at?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unit_progress: {
        Row: {
          created_at: string
          progress: number
          unit_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          progress?: number
          unit_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          progress?: number
          unit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unit_progress_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ordered_user_words"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "user_unit_progress_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_unit_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_word_progress: {
        Row: {
          completed: boolean
          created_at: string
          show_first_step: boolean
          step: number
          user_id: string
          word_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          show_first_step?: boolean
          step?: number
          user_id: string
          word_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          show_first_step?: boolean
          step?: number
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "ordered_user_words"
            referencedColumns: ["word_id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          created_at: string
          definitions: Json
          examples: Json | null
          id: string
          order: number
          unit_id: string
          word: string
        }
        Insert: {
          created_at?: string
          definitions: Json
          examples?: Json | null
          id?: string
          order: number
          unit_id: string
          word: string
        }
        Update: {
          created_at?: string
          definitions?: Json
          examples?: Json | null
          id?: string
          order?: number
          unit_id?: string
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ordered_user_words"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "words_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ordered_user_words: {
        Row: {
          completed: boolean | null
          course_id: string | null
          definitions: Json | null
          examples: Json | null
          show_first_step: boolean | null
          step: number | null
          unit_id: string | null
          unit_order: number | null
          user_id: string | null
          uwp_word_id: string | null
          word: string | null
          word_id: string | null
          word_order: number | null
        }
        Relationships: [
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["uwp_word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["uwp_word_id"]
            isOneToOne: false
            referencedRelation: "ordered_user_words"
            referencedColumns: ["word_id"]
          },
        ]
      }
      random_words: {
        Row: {
          course_id: string | null
          definitions: Json | null
          word: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
