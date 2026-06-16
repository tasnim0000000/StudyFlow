import { useMemo, useState } from 'react'
import DOMPurify from 'dompurify'
import { Plus, StickyNote } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/notes/rich-text-editor'
import { EmptyState } from '@/components/shared/empty-state'
import { useNotes } from '@/hooks/use-notes'
import { formatDate } from '@/lib/utils'

/* Calm, distinct background colours for note cards */
const NOTE_COLORS = [
  'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800',
  'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
  'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
  'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800',
]

function getNoteColor(id: string) {
  // Use note ID hash for stable color assignment
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length]
}

export function NotesPage() {
  const { notes, createNote, updateNote, deleteNote } = useNotes()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')

  const allTags = useMemo(() => [...new Set(notes.flatMap((n) => n.tags))], [notes])

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
      const matchesTag = tagFilter === 'all' || n.tags.includes(tagFilter)
      return matchesSearch && matchesTag
    })
  }, [notes, search, tagFilter])

  const openForm = (noteId?: string) => {
    const note = notes.find((n) => n.id === noteId)
    setEditingId(noteId ?? null)
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    setTags(note?.tags.join(', ') ?? '')
    setOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return }
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)
    try {
      if (editingId) {
        await updateNote({ id: editingId, title, content, tags: tagList })
        toast.success('Note updated')
      } else {
        await createNote({ title, content, tags: tagList })
        toast.success('Note created')
      }
      setOpen(false)
    } catch {
      toast.error('Failed to save note')
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture ideas with rich text and tags</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> New Note
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="all">All Tags</option>
          {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes found"
          description="Create your first note or adjust filters"
          action={<Button onClick={() => openForm()}>Create Note</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => {
            const colorClass = getNoteColor(note.id)
            return (
              <div
                key={note.id}
                className={`cursor-pointer rounded-2xl border-2 p-5 shadow-soft transition-all duration-200 hover:scale-[1.02] hover:shadow-glass ${colorClass}`}
                onClick={() => openForm(note.id)}
              >
                <h3 className="font-semibold text-foreground line-clamp-1">{note.title}</h3>
                <div
                  className="note-content mt-2 line-clamp-3 text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
                />
                <div className="mt-3 flex flex-wrap gap-1">
                  {note.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(note.updated_at)}</p>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Note' : 'New Note'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, exam, web-dev" />
            </div>
            <RichTextEditor content={content} onChange={setContent} />
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary-dark">Save</Button>
              {editingId && (
                <Button variant="destructive" onClick={async () => {
                  await deleteNote(editingId)
                  setOpen(false)
                  toast.success('Note deleted')
                }}>
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
