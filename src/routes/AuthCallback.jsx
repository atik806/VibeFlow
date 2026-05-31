import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { Spinner } from '../components/ui/Spinner'

const exchangedCodes = new Set()

export default function AuthCallback() {
  const navigate = useNavigate()
  const { ensureProfileExists } = useAuth()

  useEffect(() => {
    const supabase = getSupabase()
    let redirectDone = false

    function redirect(path) {
      if (redirectDone) return
      redirectDone = true
      console.log('[AuthCallback] Redirecting to:', path)
      navigate(path, { replace: true })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthCallback] Auth state changed:', event, !!session?.user)
      if (event === 'SIGNED_IN' && session?.user) {
        // Create profile for OAuth users
        ensureProfileExists(session.user).then(() => {
          redirect('/dashboard')
        }).catch((err) => {
          console.error('[AuthCallback] Profile creation error:', err)
          redirect('/dashboard') // Still redirect even if profile creation fails
        })
      }
    })

    async function handleCallback() {
      try {
        console.log('[AuthCallback] Starting callback handler')
        console.log('[AuthCallback] Full URL:', window.location.href)
        console.log('[AuthCallback] Search:', window.location.search)
        console.log('[AuthCallback] Hash:', window.location.hash)

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        console.log('[AuthCallback] Code from URL:', !!code, code?.substring(0, 20))

        if (code) {
          if (exchangedCodes.has(code)) {
            console.log('[AuthCallback] Code already exchanged, skipping')
            return
          }
          exchangedCodes.add(code)
          console.log('[AuthCallback] Exchanging code for session')
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('[AuthCallback] Code exchange error:', error)
            throw error
          }
          console.log('[AuthCallback] Code exchanged, user:', !!data?.session?.user)
          if (data?.session?.user) {
            // Create profile for OAuth users
            await ensureProfileExists(data.session.user)
            // Wait for auth state to propagate
            await new Promise((r) => setTimeout(r, 200))
            redirect('/dashboard')
          }
          return
        }

        const hash = window.location.hash
        console.log('[AuthCallback] Hash present:', !!hash)
        if (hash && hash.includes('access_token=')) {
          const p = new URLSearchParams(hash.slice(1))
          const session = {
            access_token: p.get('access_token'),
            refresh_token: p.get('refresh_token'),
          }
          console.log('[AuthCallback] Setting session from hash')
          if (session.access_token) {
            const { data, error } = await supabase.auth.setSession(session)
            if (error) {
              console.error('[AuthCallback] Session set error:', error)
              throw error
            }
            console.log('[AuthCallback] Session set, user:', !!data?.session?.user)
            if (data?.session?.user) {
              // Create profile for OAuth users
              await ensureProfileExists(data.session.user)
              // Wait for auth state to propagate
              await new Promise((r) => setTimeout(r, 200))
              redirect('/dashboard')
            }
            return
          }
        }

        console.log('[AuthCallback] No code or hash, checking existing session')
        const existing = await supabase.auth.getSession()
        if (existing.data?.session?.user) {
          console.log('[AuthCallback] Existing session found')
          redirect('/dashboard')
        } else {
          console.log('[AuthCallback] No session found, redirecting to login')
          redirect('/login')
        }
      } catch (err) {
        console.error('[AuthCallback] Error in handleCallback:', err)
        throw err
      }
    }

    handleCallback().catch((err) => {
      console.error('[Auth] callback error:', err)
      redirect('/login')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, ensureProfileExists])

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', flexDirection: 'column', gap: '20px' }}>
      <Spinner size="lg" />
      <div style={{ textAlign: 'center', fontSize: '12px', color: '#999', maxWidth: '400px' }}>
        <p>Processing authentication...</p>
        <p style={{ fontSize: '10px', wordBreak: 'break-all', marginTop: '10px' }}>
          URL: {window.location.href}
        </p>
      </div>
    </div>
  )
}
