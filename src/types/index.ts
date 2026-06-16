export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded'

export interface Profile {
  id: string
  name: string
  email: string
  avatar: string | null
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  course: string | null
  priority: TaskPriority
  deadline: string | null
  status: TaskStatus
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  user_id: string
  course: string
  title: string
  due_date: string
  status: AssignmentStatus
  marks: number | null
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  subject: string
  start_time: string
  end_time: string
  goal: string | null
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  goal_name: string
  target_date: string | null
  progress: number
  created_at: string
}

export interface ClassSchedule {
  id: string
  user_id: string
  class_name: string
  course: string | null
  day_of_week: number
  start_time: string
  end_time: string
}

export interface SearchResult {
  type: 'task' | 'note' | 'assignment' | 'goal' | 'study_session' | 'class'
  id: string
  title: string
  subtitle?: string
  route: string
}
