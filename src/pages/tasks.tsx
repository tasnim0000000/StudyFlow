import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/tasks/kanban-board'
import { TaskForm } from '@/components/tasks/task-form'
import { EmptyState } from '@/components/shared/empty-state'
import { useTasks } from '@/hooks/use-tasks'
import type { Task } from '@/types'
import type { TaskInput } from '@/lib/validations'
import { formatDate } from '@/lib/utils'
import { CheckSquare } from 'lucide-react'

export function TasksPage() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCourse, setFilterCourse] = useState<string>('all')

  const courses = useMemo(() => [...new Set(tasks.map((t) => t.course).filter(Boolean))], [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false
      if (filterCourse !== 'all' && t.course !== filterCourse) return false
      return true
    })
  }, [tasks, filterPriority, filterCourse])

  const handleSubmit = async (data: TaskInput) => {
    try {
      if (editingTask) {
        await updateTask({
          id: editingTask.id,
          ...data,
          description: data.description ?? null,
          course: data.course ?? null,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        })
        toast.success('Task updated')
      } else {
        await createTask({
          ...data,
          description: data.description,
          course: data.course,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
        })
        toast.success('Task created')
      }
      setEditingTask(null)
    } catch {
      toast.error('Failed to save task')
    }
  }

  const handleDelete = async () => {
    if (!editingTask) return
    try {
      await deleteTask(editingTask.id)
      toast.success('Task deleted')
      setFormOpen(false)
      setEditingTask(null)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Task Manager</h1>
          <p className="text-text-muted">Organize your assignments with Kanban, list, or calendar views</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className="rounded-xl border border-primary/20 bg-background-card px-3 py-2 text-sm"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          className="rounded-xl border border-primary/20 bg-background-card px-3 py-2 text-sm"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map((c) => <option key={c} value={c!}>{c}</option>)}
        </select>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          {filteredTasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks yet" description="Create your first task to get started" action={<Button onClick={() => setFormOpen(true)}>Create Task</Button>} />
          ) : (
            <KanbanBoard onEdit={(t) => { setEditingTask(t); setFormOpen(true) }} />
          )}
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card flex cursor-pointer items-center justify-between"
                onClick={() => { setEditingTask(task); setFormOpen(true) }}
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-text-muted">{task.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{task.status.replace('_', ' ')}</Badge>
                  <Badge variant={task.priority === 'high' ? 'danger' : 'default'}>{task.priority}</Badge>
                  {task.deadline && <span className="text-xs text-text-muted">{formatDate(task.deadline)}</span>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="glass-card">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.filter((t) => t.deadline).map((task) => (
                <div key={task.id} className="rounded-xl bg-primary/10 p-4">
                  <p className="text-xs text-text-muted">{formatDate(task.deadline!)}</p>
                  <p className="mt-1 font-medium">{task.title}</p>
                  <p className="text-sm text-text-muted">{task.course}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleSubmit}
        onDelete={editingTask ? handleDelete : undefined}
      />
    </div>
  )
}
