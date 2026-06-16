import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { Assignment, AssignmentStatus } from '@/types'

export function useAssignments() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['assignments', user?.id],
    queryFn: async (): Promise<Assignment[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getAssignments()
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })
      if (error) throw error
      return data as Assignment[]
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (assignment: {
      course: string
      title: string
      due_date: string
      status: AssignmentStatus
      marks?: number | null
    }) => {
      if (!user) throw new Error('Not authenticated')
      if (!isSupabaseConfigured || !supabase) {
        return demoStore.createAssignment({ ...assignment, marks: assignment.marks ?? null })
      }
      const { data, error } = await supabase
        .from('assignments')
        .insert({ ...assignment, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Assignment
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignments'] }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Assignment> & { id: string }) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.updateAssignment(id, updates)
      const { data, error } = await supabase.from('assignments').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data as Assignment
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignments'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.deleteAssignment(id)
      const { error } = await supabase.from('assignments').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignments'] }),
  })

  return {
    assignments: query.data ?? [],
    isLoading: query.isLoading,
    createAssignment: createMutation.mutateAsync,
    updateAssignment: updateMutation.mutateAsync,
    deleteAssignment: deleteMutation.mutateAsync,
  }
}
