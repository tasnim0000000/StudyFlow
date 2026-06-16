import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  course: z.string().max(100).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  deadline: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed']),
})

export const assignmentSchema = z.object({
  course: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['not_started', 'in_progress', 'submitted', 'graded']),
  marks: z.number().min(0).max(100).optional().nullable(),
})

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string(),
  tags: z.string().optional(),
})

export const studySessionSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  goal: z.string().optional(),
})

export const goalSchema = z.object({
  goal_name: z.string().min(1, 'Goal name is required'),
  target_date: z.string().optional(),
  progress: z.number().min(0).max(100),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TaskInput = z.infer<typeof taskSchema>
export type AssignmentInput = z.infer<typeof assignmentSchema>
export type NoteInput = z.infer<typeof noteSchema>
export type StudySessionInput = z.infer<typeof studySessionSchema>
export type GoalInput = z.infer<typeof goalSchema>
