import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { Goal } from '@/types'

export function useGoals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getGoals()
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Goal[]
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (goal: { goal_name: string; target_date?: string; progress: number }) => {
      if (!user) throw new Error('Not authenticated')
      if (!isSupabaseConfigured || !supabase) {
        return demoStore.createGoal({
          goal_name: goal.goal_name,
          target_date: goal.target_date ?? null,
          progress: goal.progress,
        })
      }
      const { data, error } = await supabase
        .from('goals')
        .insert({
          goal_name: goal.goal_name,
          target_date: goal.target_date ?? null,
          progress: goal.progress,
          user_id: user.id,
        })
        .select()
        .single()
      if (error) throw error
      return data as Goal
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.updateGoal(id, updates)
      const { data, error } = await supabase.from('goals').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data as Goal
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.deleteGoal(id)
      const { error } = await supabase.from('goals').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] }),
  })

  return {
    goals: query.data ?? [],
    isLoading: query.isLoading,
    createGoal: createMutation.mutateAsync,
    updateGoal: updateMutation.mutateAsync,
    deleteGoal: deleteMutation.mutateAsync,
  }
}
