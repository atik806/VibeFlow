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
        redirectTo: `${getAppOrigin()}/auth/callback`,
      },
    })
    if (error) throw error
  }, [])

  // Create profile after OAuth sign-in (called from AuthCallback)
  const ensureProfileExists = useCallback(async (user) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = getSupabase()

    try {
      // Check if profile exists
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (existing) {
        console.log('[Auth] Profile already exists')
        return
      }

      // Profile doesn't exist, create it
      const email = user.email || ''
      const fullName = user.user_metadata?.full_name || email.split('@')[0] || 'User'

      console.log('[Auth] Creating profile for user:', user.id)
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email, full_name: fullName })

      if (insertError) {
        // 23505 = unique violation (already exists, race condition)
        if (insertError.code === '23505') {
          console.log('[Auth] Profile already exists (race condition)')
          return
        }
        console.error('[Auth] Failed to create profile:', insertError.message)
        throw insertError
      }

      console.log('[Auth] Profile created successfully')
    } catch (err) {
      console.error('[Auth] ensureProfileExists error:', err)
      // Don't throw - allow sign-in to proceed even if profile creation fails
      // The dashboard will handle missing profiles gracefully
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithOAuth, signOut, ensureProfileExists }}>
      {children}
    </AuthContext.Provider>
  )
}
