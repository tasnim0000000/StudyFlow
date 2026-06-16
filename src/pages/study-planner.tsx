import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Pencil, Plus } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { EmptyState } from '@/components/shared/empty-state'
import { useStudySessions } from '@/hooks/use-study-sessions'
import { studySessionSchema, type StudySessionInput } from '@/lib/validations'
import type { StudySession } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'

function toLocalDatetimeValue(iso: string) {
  const d = new Date(iso)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export function StudyPlannerPage() {
  const { sessions, createSession, updateSession, deleteSession } = useStudySessions()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StudySession | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StudySessionInput>({
    resolver: zodResolver(studySessionSchema),
  })

  const sessionsByDay = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    return weekDays.map((day) => ({
      day,
      sessions: sessions.filter((s) => isSameDay(new Date(s.start_time), day)),
    }))
  }, [sessions])

  const openForm = (session?: StudySession) => {
    setEditing(session ?? null)
    if (session) {
      reset({
        subject: session.subject,
        start_time: toLocalDatetimeValue(session.start_time),
        end_time: toLocalDatetimeValue(session.end_time),
        goal: session.goal ?? '',
      })
    } else {
      reset({ subject: '', start_time: '', end_time: '', goal: '' })
    }
    setOpen(true)
  }

  const onSubmit = async (data: StudySessionInput) => {
    try {
      const payload = {
        subject: data.subject,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        goal: data.goal,
      }
      if (editing) {
        await updateSession({ id: editing.id, ...payload, goal: payload.goal ?? null })
        toast.success('Study session updated')
      } else {
        await createSession(payload)
        toast.success('Study session created')
      }
      setOpen(false)
      setEditing(null)
      reset()
    } catch {
      toast.error('Failed to save session')
    }
  }

  const getDuration = (start: string, end: string) => {
    const hours = (new Date(end).getTime() - new Date(start).getTime()) / 3600000
    return `${hours.toFixed(1)}h`
  }

  const SessionActions = ({ session }: { session: StudySession }) => (
    <div className="mt-2 flex gap-1">
      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openForm(session)}>
        <Pencil className="mr-1 h-3 w-3" /> Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-destructive"
        onClick={async () => { await deleteSession(session.id); toast.success('Deleted') }}
      >
        Delete
      </Button>
    </div>
  )

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Planner</h1>
          <p className="text-text-muted">Plan and track your study sessions</p>
        </div>
        <Button onClick={() => openForm()}><Plus className="h-4 w-4" /> New Session</Button>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <div className="grid gap-4 md:grid-cols-7">
            {sessionsByDay.map(({ day, sessions: daySessions }) => (
              <div key={day.toISOString()} className="glass-card min-h-[120px]">
                <p className="mb-2 text-sm font-semibold">{format(day, 'EEE')}</p>
                <p className="mb-3 text-xs text-text-muted">{format(day, 'MMM d')}</p>
                {daySessions.map((s) => (
                  <div key={s.id} className="mb-2 rounded-lg bg-accent-mint/40 p-2 text-xs">
                    <p className="font-medium">{s.subject}</p>
                    <p className="text-text-muted">{formatTime(s.start_time)}</p>
                    <SessionActions session={s} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="glass-card grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-xl bg-primary/10 p-4">
                <p className="font-medium">{s.subject}</p>
                <p className="text-sm text-text-muted">{formatDate(s.start_time)}</p>
                <p className="text-xs text-text-muted">{getDuration(s.start_time, s.end_time)}</p>
                <SessionActions session={s} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          {sessions.length === 0 ? (
            <EmptyState icon={BookOpen} title="No study sessions" description="Start planning your study time" action={<Button onClick={() => openForm()}>Add Session</Button>} />
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="glass-card flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{s.subject}</p>
                    <p className="text-sm text-text-muted">{s.goal}</p>
                    <p className="text-xs text-text-muted">{formatDate(s.start_time)} · {formatTime(s.start_time)} – {formatTime(s.end_time)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-accent-mint px-3 py-1 text-sm font-medium">{getDuration(s.start_time, s.end_time)}</span>
                    <Button variant="outline" size="sm" onClick={() => openForm(s)}>
                      <Pencil className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={async () => { await deleteSession(s.id); toast.success('Deleted') }}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Study Session' : 'New Study Session'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label>Subject</Label><Input {...register('subject')} />{errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}</div>
            <div><Label>Start Time</Label><Input type="datetime-local" {...register('start_time')} /></div>
            <div><Label>End Time</Label><Input type="datetime-local" {...register('end_time')} /></div>
            <div><Label>Goal</Label><Textarea {...register('goal')} placeholder="What do you want to accomplish?" /></div>
            <Button type="submit" disabled={isSubmitting} className="w-full">{editing ? 'Update Session' : 'Create Session'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
