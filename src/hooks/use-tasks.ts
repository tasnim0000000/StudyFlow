import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { Task, TaskPriority, TaskStatus } from '@/types'

export function useTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async (): Promise<Task[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getTasks()
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Task[]
    },
    enabled: !!user,
  })

  const createMutation = useMutation({
    mutationFn: async (task: {
      title: string
      description?: string
      course?: string
      priority: TaskPriority
      deadline?: string
      status: TaskStatus
    }) => {
      if (!user) throw new Error('Not authenticated')
      if (!isSupabaseConfigured || !supabase) {
        return demoStore.createTask({
          title: task.title,
          description: task.description ?? null,
          course: task.course ?? null,
          priority: task.priority,
          deadline: task.deadline ?? null,
          status: task.status,
        })
      }
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Task
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.updateTask(id, updates)
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
      if (error) throw error
      return data as Task
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured || !supabase) return demoStore.deleteTask(id)
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  }
}
