export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          course: string | null
          priority: 'low' | 'medium' | 'high'
          deadline: string | null
          status: 'todo' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          course?: string | null
          priority?: 'low' | 'medium' | 'high'
          deadline?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          course?: string | null
          priority?: 'low' | 'medium' | 'high'
          deadline?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          user_id: string
          course: string
          title: string
          due_date: string
          status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
          marks: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course: string
          title: string
          due_date: string
          status?: 'not_started' | 'in_progress' | 'submitted' | 'graded'
          marks?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course?: string
          title?: string
          due_date?: string
          status?: 'not_started' | 'in_progress' | 'submitted' | 'graded'
          marks?: number | null
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject: string
          start_time: string
          end_time: string
          goal: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          start_time: string
          end_time: string
          goal?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          start_time?: string
          end_time?: string
          goal?: string | null
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          goal_name: string
          target_date: string | null
          progress: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_name: string
          target_date?: string | null
          progress?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_name?: string
          target_date?: string | null
          progress?: number
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          user_id: string
          class_name: string
          course: string | null
          day_of_week: number
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          user_id: string
          class_name: string
          course?: string | null
          day_of_week: number
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          user_id?: string
          class_name?: string
          course?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
        }
      }
    }
  }
}
