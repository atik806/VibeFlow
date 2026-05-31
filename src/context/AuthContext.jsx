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
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (cancelled) return
      // Only process SIGNED_IN — needed for OAuth callback completion.
      // SIGNED_OUT is handled explicitly in signOut().
      // INITIAL_SESSION is handled by getSession().
      // TOKEN_REFRESHED / USER_UPDATED don't affect auth state.
      if (event === 'SIGNED_IN') {
        setSession(s)
        setUser(s?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Auth is not configured. Set Supabase environment variables.')
    }
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data?.session) {
      setSession(data.session)
      setUser(data.session.user)
    }
    return data
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

    if (data?.user) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const { error: pe } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, email, full_name: fullName }, { ignoreDuplicates: true })
        if (!pe) break
        if (pe.code === '42P01') break
        if (attempt < 2) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
      }
    }

    if (data?.session) {
      setSession(data.session)
      setUser(data.session.user)
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

  const ensureProfileExists = useCallback(async (user) => {
    if (!user || !isSupabaseConfigured()) return
    const supabase = getSupabase()
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()
      if (existing) return
      const email = user.email || ''
      const fullName = user.user_metadata?.full_name || email.split('@')[0] || 'User'
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email, full_name: fullName })
      if (insertError && insertError.code !== '23505') throw insertError
    } catch (err) {
      console.error('[Auth] ensureProfileExists error:', err)
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setSession(null)
      setUser(null)
    }
    if (error) throw error
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signInWithOAuth, signOut, ensureProfileExists }}>
      {children}
    </AuthContext.Provider>
  )
}
