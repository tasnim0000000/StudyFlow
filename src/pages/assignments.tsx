import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClipboardList, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/shared/empty-state'
import { useAssignments } from '@/hooks/use-assignments'
import { assignmentSchema, type AssignmentInput } from '@/lib/validations'
import type { Assignment } from '@/types'
import { formatDate } from '@/lib/utils'

/* Calm, distinct color palette for assignment cards */
const CARD_COLORS = [
  { bg: 'bg-rose-50   dark:bg-rose-950/40',   border: 'border-rose-200   dark:border-rose-800',   dot: 'bg-rose-400',   label: 'text-rose-700   dark:text-rose-300'   },
  { bg: 'bg-sky-50    dark:bg-sky-950/40',    border: 'border-sky-200    dark:border-sky-800',    dot: 'bg-sky-400',    label: 'text-sky-700    dark:text-sky-300'    },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-400', label: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800', dot: 'bg-violet-400', label: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-amber-50  dark:bg-amber-950/40',  border: 'border-amber-200  dark:border-amber-800',  dot: 'bg-amber-400',  label: 'text-amber-700  dark:text-amber-300'  },
  { bg: 'bg-teal-50   dark:bg-teal-950/40',   border: 'border-teal-200   dark:border-teal-800',   dot: 'bg-teal-400',   label: 'text-teal-700   dark:text-teal-300'   },
  { bg: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800', dot: 'bg-orange-400', label: 'text-orange-700 dark:text-orange-300' },
  { bg: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-400', label: 'text-indigo-700 dark:text-indigo-300' },
]

function getCardColor(index: number) {
  return CARD_COLORS[index % CARD_COLORS.length]
}

export function AssignmentsPage() {
  const { assignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Assignment | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { status: 'not_started' },
  })

  const openForm = (assignment?: Assignment) => {
    setEditing(assignment ?? null)
    if (assignment) {
      reset({
        course: assignment.course,
        title: assignment.title,
        due_date: assignment.due_date.slice(0, 10),
        status: assignment.status,
        marks: assignment.marks,
      })
    } else {
      reset({ course: '', title: '', due_date: '', status: 'not_started' })
    }
    setOpen(true)
  }

  const onSubmit = async (data: AssignmentInput) => {
    try {
      const payload = {
        ...data,
        due_date: new Date(data.due_date).toISOString(),
        marks: data.marks ?? null,
      }
      if (editing) {
        await updateAssignment({ id: editing.id, ...payload })
        toast.success('Assignment updated')
      } else {
        await createAssignment(payload)
        toast.success('Assignment created')
      }
      setOpen(false)
    } catch {
      toast.error('Failed to save assignment')
    }
  }

  const getDaysUntil = (date: string) => {
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const statusBadge = (status: Assignment['status']) => {
    const map = {
      not_started: 'default',
      in_progress:  'warning',
      submitted:    'success',
      graded:       'success',
    } as const
    return map[status] ?? 'default'
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignment Tracker</h1>
          <p className="text-muted-foreground">Track deadlines, status, and grades</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description="Add your university assignments to track deadlines and grades"
          action={<Button onClick={() => openForm()}>Add Assignment</Button>}
        />
      ) : (
        <div className="relative space-y-4 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-primary/30">
          {assignments.map((a, idx) => {
            const days = getDaysUntil(a.due_date)
            const colors = getCardColor(idx)
            return (
              <div
                key={a.id}
                className={`relative cursor-pointer rounded-2xl border-2 p-5 shadow-soft transition-all duration-200 hover:scale-[1.01] hover:shadow-glass ${colors.bg} ${colors.border}`}
                onClick={() => openForm(a)}
              >
                <div className={`absolute -left-8 top-6 h-3 w-3 rounded-full ring-4 ring-background ${colors.dot}`} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={`font-semibold text-base ${colors.label}`}>{a.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{a.course}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={days <= 3 && days >= 0 ? 'danger' : days < 0 ? 'danger' : 'outline'}>
                      {days < 0 ? 'Overdue' : days === 0 ? 'Due today' : `${days}d left`}
                    </Badge>
                    <Badge variant={statusBadge(a.status)}>
                      {a.status.replace('_', ' ')}
                    </Badge>
                    {a.marks !== null && (
                      <Badge variant="success">{a.marks}%</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{formatDate(a.due_date)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Assignment' : 'New Assignment'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Course</Label>
              <Input placeholder="e.g. CSE 301" {...register('course')} />
              {errors.course && <p className="text-xs text-destructive">{errors.course.message}</p>}
            </div>
            <div>
              <Label>Title</Label>
              <Input placeholder="Assignment title" {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" {...register('due_date')} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as AssignmentInput['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Marks (%)</Label>
              <Input type="number" min="0" max="100" placeholder="Leave blank if not graded" {...register('marks', { valueAsNumber: true })} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary-dark">
                {editing ? 'Update' : 'Create'}
              </Button>
              {editing && (
                <Button type="button" variant="destructive" onClick={async () => {
                  await deleteAssignment(editing.id)
                  setOpen(false)
                  toast.success('Assignment deleted')
                }}>
                  Delete
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
