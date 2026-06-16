import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { taskSchema, type TaskInput } from '@/lib/validations'
import type { Task } from '@/types'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSubmit: (data: TaskInput) => Promise<void>
  onDelete?: () => Promise<void>
}

export function TaskForm({ open, onOpenChange, task, onSubmit, onDelete }: TaskFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: 'medium', status: 'todo' },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        course: task.course ?? '',
        priority: task.priority,
        deadline: task.deadline ? task.deadline.slice(0, 16) : '',
        status: task.status,
      })
    } else {
      reset({ title: '', description: '', course: '', priority: 'medium', status: 'todo', deadline: '' })
    }
  }, [task, reset, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            await onSubmit(data)
            onOpenChange(false)
          })}
          className="space-y-4"
        >
          <div>
            <Label>Title</Label>
            <Input {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
          </div>
          <div>
            <Label>Course</Label>
            <Input {...register('course')} placeholder="CS301 Web Development" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v as TaskInput['priority'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as TaskInput['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Deadline</Label>
            <Input type="datetime-local" {...register('deadline')} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {task ? 'Update' : 'Create'}
            </Button>
            {task && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>Delete</Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
