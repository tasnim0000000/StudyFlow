import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { StudySession } from '@/types'

export function useStudySessions() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async (): Promise<StudySession[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getStudySessions()
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
      if (error) throw error
      return data as StudySession[]
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (session: {
      subject: string
      start_time: string
      end_time: string
      goal?: string
    }) => {
      if (!user) throw new Error('Not authenticated')
      if (!isSupabaseConfigured || !supabase) {
        return demoStore.createStudySession({ ...session, goal: session.goal ?? null })
      }
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({ ...session, user_id: user.id, goal: session.goal ?? null })
        .select()
        .single()
      if (error) throw error
      return data as StudySession
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-sessions'] }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StudySession> & { id: string }) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.updateStudySession(id, updates)
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as StudySession
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-sessions'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.deleteStudySession(id)
      const { error } = await supabase.from('study_sessions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['study-sessions'] }),
  })

  return {
    sessions: query.data ?? [],
    isLoading: query.isLoading,
    createSession: createMutation.mutateAsync,
    updateSession: updateMutation.mutateAsync,
    deleteSession: deleteMutation.mutateAsync,
  }
}
