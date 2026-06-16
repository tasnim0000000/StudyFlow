import { useMemo } from 'react'
import { useAssignments } from '@/hooks/use-assignments'
import { useClasses } from '@/hooks/use-classes'
import { useGoals } from '@/hooks/use-goals'
import { useNotes } from '@/hooks/use-notes'
import { useStudySessions } from '@/hooks/use-study-sessions'
import { useTasks } from '@/hooks/use-tasks'
import { matchesSearch, stripHtml } from '@/lib/search-utils'
import type { SearchResult } from '@/types'

export function useGlobalSearch(query: string) {
  const { tasks } = useTasks()
  const { notes } = useNotes()
  const { assignments } = useAssignments()
  const { goals } = useGoals()
  const { sessions } = useStudySessions()
  const { classes } = useClasses()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const items: SearchResult[] = []

    tasks.forEach((t) => {
      if (matchesSearch(query, t.title, t.description, t.course, t.status, t.priority)) {
        items.push({ type: 'task', id: t.id, title: t.title, subtitle: t.course ?? undefined, route: '/tasks' })
      }
    })

    notes.forEach((n) => {
      const plain = stripHtml(n.content)
      if (matchesSearch(query, n.title, plain, ...n.tags)) {
        items.push({ type: 'note', id: n.id, title: n.title, subtitle: n.tags.join(', '), route: '/notes' })
      }
    })

    assignments.forEach((a) => {
      if (matchesSearch(query, a.title, a.course, a.status)) {
        items.push({ type: 'assignment', id: a.id, title: a.title, subtitle: a.course, route: '/assignments' })
      }
    })

    goals.forEach((g) => {
      if (matchesSearch(query, g.goal_name)) {
        items.push({ type: 'goal', id: g.id, title: g.goal_name, route: '/goals' })
      }
    })

    sessions.forEach((s) => {
      if (matchesSearch(query, s.subject, s.goal)) {
        items.push({
          type: 'study_session',
          id: s.id,
          title: s.subject,
          subtitle: s.goal ?? 'Study session',
          route: '/study-planner',
        })
      }
    })

    classes.forEach((c) => {
      if (matchesSearch(query, c.class_name, c.course)) {
        items.push({
          type: 'class',
          id: c.id,
          title: c.class_name,
          subtitle: c.course ?? 'Class',
          route: '/calendar',
        })
      }
    })

    return items.slice(0, 15)
  }, [query, tasks, notes, assignments, goals, sessions, classes])

  return results
}
