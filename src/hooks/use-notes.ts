import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { Note } from '@/types'

export function useNotes() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async (): Promise<Note[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getNotes()
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Note[]
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (note: { title: string; content: string; tags: string[] }) => {
      if (!user) throw new Error('Not authenticated')
      if (!isSupabaseConfigured || !supabase) return demoStore.createNote(note)
      const { data, error } = await supabase
        .from('notes')
        .insert({ ...note, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Note
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Note> & { id: string }) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.updateNote(id, updates)
      const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data as Note
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.deleteNote(id)
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    createNote: createMutation.mutateAsync,
    updateNote: updateMutation.mutateAsync,
    deleteNote: deleteMutation.mutateAsync,
  }
}
