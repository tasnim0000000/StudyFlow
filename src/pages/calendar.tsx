import { useMemo, useState } from 'react'
import { Calendar as BigCalendar, dateFnsLocalizer, type View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useAssignments } from '@/hooks/use-assignments'
import { useClasses } from '@/hooks/use-classes'
import { useStudySessions } from '@/hooks/use-study-sessions'
import { useTasks } from '@/hooks/use-tasks'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: 'task' | 'assignment' | 'study' | 'class'
}

const eventColors: Record<string, string> = {
  task: '#CDB4DB',
  assignment: '#FFC8DD',
  study: '#D8F3DC',
  class: '#BDE0FE',
}

export function CalendarPage() {
  const { tasks } = useTasks()
  const { assignments } = useAssignments()
  const { sessions } = useStudySessions()
  const { classes } = useClasses()
  const [view, setView] = useState<View>('month')

  const events = useMemo((): CalendarEvent[] => {
    const items: CalendarEvent[] = []

    tasks.filter((t) => t.deadline).forEach((t) => {
      const d = new Date(t.deadline!)
      items.push({ id: `task-${t.id}`, title: `📋 ${t.title}`, start: d, end: d, type: 'task' })
    })

    assignments.forEach((a) => {
      const d = new Date(a.due_date)
      items.push({ id: `assign-${a.id}`, title: `📝 ${a.title}`, start: d, end: d, type: 'assignment' })
    })

    sessions.forEach((s) => {
      items.push({
        id: `session-${s.id}`,
        title: `📚 ${s.subject}`,
        start: new Date(s.start_time),
        end: new Date(s.end_time),
        type: 'study',
      })
    })

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    classes.forEach((c) => {
      const dayOffset = (c.day_of_week - weekStart.getDay() + 7) % 7
      const classDate = new Date(weekStart)
      classDate.setDate(classDate.getDate() + dayOffset)
      const [sh, sm] = c.start_time.split(':').map(Number)
      const [eh, em] = c.end_time.split(':').map(Number)
      const start = new Date(classDate)
      start.setHours(sh, sm)
      const end = new Date(classDate)
      end.setHours(eh, em)
      items.push({ id: `class-${c.id}`, title: `🎓 ${c.class_name}`, start, end, type: 'class' })
    })

    return items
  }, [tasks, assignments, sessions, classes])

  return (
    <div className="page-container">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-text-muted">View classes, tasks, assignments, and study sessions</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {Object.entries(eventColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize text-text-muted">{type}</span>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden p-2">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          style={{ height: 600 }}
          eventPropGetter={(event) => ({
            style: { backgroundColor: eventColors[event.type], border: 'none', borderRadius: '8px' },
          })}
        />
      </div>
    </div>
  )
}
