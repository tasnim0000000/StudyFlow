import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { demoStore } from '@/lib/demo-store'
import { findDemoUserByEmail, findDemoUserById, validateDemoCredentials } from '@/lib/demo-users'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import type { Profile } from '@/types'

interface AuthContextValue {
  user: Profile | null
  isLoading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isDemo = !isSupabaseConfigured

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return data as Profile | null
  }, [])

  useEffect(() => {
    async function init() {
      if (isDemo) {
        const userId = demoStore.restoreSession()
        if (userId) {
          const account = findDemoUserById(userId)
          if (account) {
            demoStore.setCurrentUser(userId)
            setUser(demoStore.getProfile())
          }
        }
        setIsLoading(false)
        return
      }

      if (!supabase) {
        setIsLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await loadProfile(session.user.id)
        if (profile) setUser(profile)
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile = await loadProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }
      })

      setIsLoading(false)
      return () => subscription.unsubscribe()
    }

    init()
  }, [isDemo, loadProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    if (isDemo) {
      const account = validateDemoCredentials(email, password)
      if (!account) {
        throw new Error('Invalid email or password')
      }
      demoStore.setCurrentUser(account.id)
      setUser(demoStore.getProfile())
      await queryClient.invalidateQueries()
      return
    }
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await queryClient.invalidateQueries()
  }, [isDemo, queryClient])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (isDemo) {
      // In demo mode only pre-seeded accounts can log in
      const account = validateDemoCredentials(email, password)
      if (!account) {
        throw new Error('Demo mode only supports pre-seeded accounts. See DEMO_CREDENTIALS.md')
      }
      demoStore.setCurrentUser(account.id)
      setUser({ ...account.profile, name })
      return
    }
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
  }, [isDemo])

  const signOut = useCallback(async () => {
    if (isDemo) {
      demoStore.clearCurrentUser()
      setUser(null)
      await queryClient.invalidateQueries()
      return
    }
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    await queryClient.invalidateQueries()
  }, [isDemo, queryClient])

  const resetPassword = useCallback(async (email: string) => {
    if (isDemo) {
      if (!findDemoUserByEmail(email)) throw new Error('Account not found in demo mode')
      return
    }
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) throw error
  }, [isDemo])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return
    if (isDemo) {
      const updated = demoStore.updateProfile(updates)
      setUser(updated)
      return
    }
    if (!supabase) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setUser(data as Profile)
  }, [user, isDemo])

  const value = useMemo(
    () => ({ user, isLoading, isDemo, signIn, signUp, signOut, resetPassword, updateProfile }),
    [user, isLoading, isDemo, signIn, signUp, signOut, resetPassword, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
