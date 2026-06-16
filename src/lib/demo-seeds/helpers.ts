import type { TaskPriority, TaskStatus, AssignmentStatus } from '@/types'

export function daysFromNow(days: number, base = new Date()): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function sessionTime(daysAgo: number, startHour: number, durationHours: number, base = new Date()) {
  const start = new Date(base)
  start.setDate(start.getDate() - daysAgo)
  start.setHours(startHour, 0, 0, 0)
  const end = new Date(start)
  end.setHours(start.getHours() + durationHours)
  return { start_time: start.toISOString(), end_time: end.toISOString() }
}

export const COURSES = {
  cs301: 'CS301 Web Development',
  cs202: 'CS202 Database Systems',
  cs401: 'CS401 Software Engineering',
  math205: 'MATH205 Linear Algebra',
  phys101: 'PHYS101 Physics I',
  eng202: 'ENG202 Modern Literature',
  cs350: 'CS350 Data Structures',
  bus210: 'BUS210 Business Analytics',
} as const

export const priorities: TaskPriority[] = ['low', 'medium', 'high']
export const taskStatuses: TaskStatus[] = ['todo', 'in_progress', 'completed']
export const assignmentStatuses: AssignmentStatus[] = ['not_started', 'in_progress', 'submitted', 'graded']
