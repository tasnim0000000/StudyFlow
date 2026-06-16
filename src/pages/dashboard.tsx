import { Calendar, CheckCircle2, Clock, ListTodo, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProductivityScore } from '@/components/dashboard/productivity-score'
import { StatCard } from '@/components/dashboard/stat-card'
import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { useAssignments } from '@/hooks/use-assignments'
import { useClasses } from '@/hooks/use-classes'
import { useGoals } from '@/hooks/use-goals'
import { useStudySessions } from '@/hooks/use-study-sessions'
import { useTasks } from '@/hooks/use-tasks'
import { calculateProductivityScore } from '@/lib/productivity-score'
import { formatDate } from '@/lib/utils'

export function DashboardPage() {
  const { tasks } = useTasks()
  const { assignments } = useAssignments()
  const { sessions } = useStudySessions()
  const { goals } = useGoals()
  const { classes } = useClasses()

  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length
  const upcomingDeadlines = [...tasks, ...assignments].filter((item) => {
    const date = 'deadline' in item ? item.deadline : item.due_date
    if (!date) return false
    const diff = new Date(date).getTime() - Date.now()
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
  }).length

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const studyHoursThisWeek = sessions
    .filter((s) => new Date(s.start_time).getTime() > weekAgo)
    .reduce((acc, s) => {
      const hours = (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3600000
      return acc + hours
    }, 0)

  const goalProgressAvg = goals.length
    ? goals.reduce((acc, g) => acc + g.progress, 0) / goals.length
    : 0

  const score = calculateProductivityScore({
    completedTasks,
    totalTasks: tasks.length,
    studyHoursThisWeek,
    goalProgressAvg,
  })

  const today = new Date().getDay()
  const todayClasses = classes.filter((c) => c.day_of_week === today)

  const upcomingItems = [
    ...assignments.map((a) => ({
      id: a.id,
      title: a.title,
      course: a.course,
      dueDate: a.due_date,
      priority: 'high' as const,
      type: 'assignment' as const,
    })),
    ...tasks.filter((t) => t.deadline).map((t) => ({
      id: t.id,
      title: t.title,
      course: t.course ?? 'General',
      dueDate: t.deadline!,
      priority: t.priority,
      type: 'task' as const,
    })),
  ]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="page-container">
      <WelcomeSection />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Tasks"         value={tasks.length}                          icon={ListTodo}    color="lavender" index={0} href="/tasks" />
        <StatCard title="Completed"           value={completedTasks}                        icon={CheckCircle2} color="mint"    index={1} href="/tasks" />
        <StatCard title="Pending"             value={pendingTasks}                          icon={Clock}       color="pink"     index={2} href="/tasks" />
        <StatCard title="Upcoming Deadlines"  value={upcomingDeadlines}                     icon={Calendar}    color="blue"     index={3} href="/assignments" />
        <StatCard title="Study Hours (Week)"  value={`${studyHoursThisWeek.toFixed(1)}h`}  icon={Target}      color="yellow"   index={4} href="/study-planner" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProductivityScore score={score} />
        </div>

        <div className="glass-card lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming deadlines 🎉</p>
            ) : (
              upcomingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-primary/10 p-3">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.priority === 'high' ? 'danger' : 'default'}>
                      {item.priority}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(item.dueDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-card lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold">Today&apos;s Schedule</h3>
          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled today</p>
            ) : (
              todayClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between rounded-xl bg-sky-100/60 dark:bg-sky-900/30 p-3">
                  <div>
                    <p className="text-sm font-medium">{cls.class_name}</p>
                    <p className="text-xs text-muted-foreground">{cls.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{cls.start_time} – {cls.end_time}</p>
                    <Badge variant="success" className="mt-1">Scheduled</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
