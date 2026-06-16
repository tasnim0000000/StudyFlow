import { useQuery } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import { useAuth } from '@/providers/auth-provider'
import type { ClassSchedule } from '@/types'

export function useClasses() {
  const { user } = useAuth()

  const query = useQuery({
    queryKey: ['classes', user?.id],
    queryFn: async (): Promise<ClassSchedule[]> => {
      if (!user) return []
      if (!isSupabaseConfigured || !supabase) return demoStore.getClasses()
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('user_id', user.id)
      if (error) throw error
      return data as ClassSchedule[]
    },
    enabled: !!user,
  })

  return { classes: query.data ?? [], isLoading: query.isLoading }
}
