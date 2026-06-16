import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, Target } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/shared/empty-state'
import { useGoals } from '@/hooks/use-goals'
import { goalSchema, type GoalInput } from '@/lib/validations'
import type { Goal } from '@/types'
import { formatDate } from '@/lib/utils'

export function GoalsPage() {
  const { goals, createGoal, updateGoal, deleteGoal } = useGoals()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: { progress: 0 },
  })

  const openForm = (goal?: Goal) => {
    setEditing(goal ?? null)
    if (goal) {
      reset({ goal_name: goal.goal_name, target_date: goal.target_date ?? '', progress: goal.progress })
    } else {
      reset({ goal_name: '', target_date: '', progress: 0 })
    }
    setOpen(true)
  }

  const onSubmit = async (data: GoalInput) => {
    try {
      const payload = { goal_name: data.goal_name, target_date: data.target_date || undefined, progress: data.progress }
      if (editing) {
        await updateGoal({ id: editing.id, ...payload, target_date: payload.target_date ?? null })
        toast.success('Goal updated')
      } else {
        await createGoal(payload)
        toast.success('Goal created')
      }
      setOpen(false)
    } catch {
      toast.error('Failed to save goal')
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goal Tracker</h1>
          <p className="text-text-muted">Set targets and track your progress</p>
        </div>
        <Button onClick={() => openForm()}><Plus className="h-4 w-4" /> New Goal</Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState icon={Target} title="No goals yet" description="Set academic goals to stay motivated" action={<Button onClick={() => openForm()}>Create Goal</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card cursor-pointer"
              onClick={() => openForm(goal)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{goal.goal_name}</h3>
                <span className="text-lg font-bold text-primary-dark">{goal.progress}%</span>
              </div>
              {goal.target_date && <p className="mt-1 text-sm text-text-muted">Target: {formatDate(goal.target_date)}</p>}
              <div className="mt-4">
                <Progress value={goal.progress} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Goal' : 'New Goal'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Label>Goal Name</Label><Input {...register('goal_name')} />{errors.goal_name && <p className="text-xs text-destructive">{errors.goal_name.message}</p>}</div>
            <div><Label>Target Date</Label><Input type="date" {...register('target_date')} /></div>
            <div>
              <Label>Progress: {watch('progress')}%</Label>
              <input type="range" min={0} max={100} className="mt-2 w-full accent-primary" {...register('progress', { valueAsNumber: true })} onChange={(e) => setValue('progress', Number(e.target.value))} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">{editing ? 'Update' : 'Create'}</Button>
              {editing && <Button type="button" variant="destructive" onClick={async () => { await deleteGoal(editing.id); setOpen(false); toast.success('Deleted') }}>Delete</Button>}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
