import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './kanban-card'
import type { Task, TaskStatus } from '@/types'

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onEdit,
}: {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
  onEdit: (task: Task) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl p-4 transition-colors ${color} ${isOver ? 'ring-2 ring-primary/40' : ''}`}
    >
      <h3 className="mb-4 font-semibold text-text">
        {title} <span className="text-text-muted">({tasks.length})</span>
      </h3>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
