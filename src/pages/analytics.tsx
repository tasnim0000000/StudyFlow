import { useMemo } from 'react'
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAssignments } from '@/hooks/use-assignments'
import { useGoals } from '@/hooks/use-goals'
import { useStudySessions } from '@/hooks/use-study-sessions'
import { useTasks } from '@/hooks/use-tasks'

const COLORS = ['#CDB4DB', '#FFC8DD', '#BDE0FE', '#D8F3DC', '#FFF1B6']

export function AnalyticsPage() {
  const { tasks } = useTasks()
  const { sessions } = useStudySessions()
  const { goals } = useGoals()
  const { assignments } = useAssignments()

  const dailyHours = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() })
    return days.map((day) => {
      const daySessions = sessions.filter((s) => format(new Date(s.start_time), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
      const hours = daySessions.reduce((acc, s) => acc + (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3600000, 0)
      return { day: format(day, 'EEE'), hours: Math.round(hours * 10) / 10 }
    })
  }, [sessions])

  const weeklyHours = useMemo(() => {
    const weeks = [0, 1, 2, 3].map((w) => {
      const start = startOfWeek(subDays(new Date(), w * 7), { weekStartsOn: 1 })
      const end = subDays(start, -6)
      const weekSessions = sessions.filter((s) => {
        const d = new Date(s.start_time)
        return d >= start && d <= end
      })
      const hours = weekSessions.reduce((acc, s) => acc + (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3600000, 0)
      return { week: `W${4 - w}`, hours: Math.round(hours * 10) / 10 }
    }).reverse()
    return weeks
  }, [sessions])

  const taskCompletion = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length
    const pending = tasks.length - completed
    return [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ]
  }, [tasks])

  const goalCompletion = useMemo(() => {
    const done = goals.filter((g) => g.progress >= 100).length
    const inProgress = goals.length - done
    return [
      { name: 'Completed', value: done },
      { name: 'In Progress', value: inProgress },
    ]
  }, [goals])

  const assignmentStatus = useMemo(() => {
    const statuses = ['not_started', 'in_progress', 'submitted', 'graded'] as const
    return statuses.map((s) => ({
      status: s.replace('_', ' '),
      count: assignments.filter((a) => a.status === s).length,
    }))
  }, [assignments])

  const totalStudyHours = sessions.reduce((acc, s) => acc + (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 3600000, 0)

  return (
    <div className="page-container">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted">Track your productivity and study patterns</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm text-text-muted">Total Study Hours</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalStudyHours.toFixed(1)}h</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-text-muted">Task Completion</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{tasks.length ? Math.round((tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100) : 0}%</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-text-muted">Goals Completed</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{goals.filter((g) => g.progress >= 100).length}/{goals.length}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Daily Study Hours</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CDB4DB33" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#CDB4DB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Weekly Study Hours</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CDB4DB33" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#B8A0C8" strokeWidth={3} dot={{ fill: '#B8A0C8' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Task Completion Rate</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskCompletion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {taskCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Assignment Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={assignmentStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CDB4DB33" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#BDE0FE" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Goal Completion</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={goalCompletion} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {goalCompletion.map((_, i) => <Cell key={i} fill={COLORS[i + 2]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
