import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useTasks } from '@/hooks/use-tasks'
import type { Task, TaskStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { KanbanColumn } from './kanban-column'

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-accent-yellow/40' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-accent-blue/40' },
  { id: 'completed', title: 'Completed', color: 'bg-accent-mint/40' },
]

function TaskCardContent({ task }: { task: Task }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-background-card p-4 shadow-soft">
      <p className="font-medium text-text">{task.title}</p>
      {task.course && <p className="mt-1 text-xs text-text-muted">{task.course}</p>}
      <div className="mt-3 flex items-center justify-between">
        <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'outline'}>
          {task.priority}
        </Badge>
        {task.deadline && <span className="text-xs text-text-muted">{formatDate(task.deadline)}</span>}
      </div>
    </div>
  )
}

export function KanbanBoard({ onEdit }: { onEdit: (task: Task) => void }) {
  const { tasks, updateTask } = useTasks()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status !== newStatus && columns.some((c) => c.id === newStatus)) {
      await updateTask({ id: taskId, status: newStatus })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tasks={tasks.filter((t) => t.status === col.id)}
            onEdit={onEdit}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <motion.div initial={{ scale: 1.05 }} animate={{ scale: 1.05 }}>
            <TaskCardContent task={activeTask} />
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
