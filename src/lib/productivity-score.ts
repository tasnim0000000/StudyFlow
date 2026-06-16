export interface ProductivityScoreInput {
  completedTasks: number
  totalTasks: number
  studyHoursThisWeek: number
  targetStudyHours?: number
  goalProgressAvg: number
}

export function calculateProductivityScore({
  completedTasks,
  totalTasks,
  studyHoursThisWeek,
  targetStudyHours = 20,
  goalProgressAvg,
}: ProductivityScoreInput): number {
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 0
  const studyRate = Math.min(studyHoursThisWeek / targetStudyHours, 1) * 35
  const goalRate = (goalProgressAvg / 100) * 25
  return Math.round(Math.min(taskRate + studyRate + goalRate, 100))
}
