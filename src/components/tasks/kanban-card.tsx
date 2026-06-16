import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import type { Task } from '@/types'
import { formatDate } from '@/lib/utils'

export function KanbanCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
      className="cursor-grab rounded-xl border border-primary/10 bg-background-card p-4 shadow-soft active:cursor-grabbing"
    >
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
