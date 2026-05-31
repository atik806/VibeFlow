import { useEffect, useState, useCallback } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { getAppOrigin } from '../lib/appOrigin'
import { AuthContext } from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      queueMicrotask(() => setLoading(false))
      return
    }

    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Auth is not configured. Set Supabase environment variables.')
    }
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(async (email, password, fullName) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Auth is not configured. Set Supabase environment variables.')
    }
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error

    // Create profile row client-side (only source — no DB trigger)
    if (data?.user) {
      // Retry with backoff in case of replication lag
      for (let attempt = 0; attempt < 3; attempt++) {
        const { error: pe } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, email, full_name: fullName }, { ignoreDuplicates: true })
        if (!pe) break
        if (pe.code === '42P01') {
          console.warn('[Auth] profiles table not found — skipping profile insert')
          break
        }
        if (attempt < 2) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
        else console.warn('[Auth] Profile upsert failed after 3 attempts:', pe.message)
      }
    }

    return data
  }, [])

  const signInWithOAuth = useCallback(async (provider) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Auth is not configured. Set Supabase environment variables.')
    }
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${getAppOrigin()}/dashboard`,
      },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithOAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
