import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '../lib/supabaseClient'
import { Spinner } from '../components/ui/Spinner'

const exchangedCodes = new Set()

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const supabase = getSupabase()
    let redirectDone = false

    function redirect(path) {
      if (redirectDone) return
      redirectDone = true
      navigate(path, { replace: true })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        redirect('/dashboard')
      }
    })

    async function handleCallback() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        if (exchangedCodes.has(code)) return
        exchangedCodes.add(code)
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error
        if (data?.session?.user) {
          // Wait a tick to ensure onAuthStateChange fires
          await new Promise((r) => setTimeout(r, 0))
          redirect('/dashboard')
        }
        return
      }

      const hash = window.location.hash
      if (hash && hash.includes('access_token=')) {
        const p = new URLSearchParams(hash.slice(1))
        const session = {
          access_token: p.get('access_token'),
          refresh_token: p.get('refresh_token'),
        }
        if (session.access_token) {
          const { data, error } = await supabase.auth.setSession(session)
          if (error) throw error
          if (data?.session?.user) {
            // Wait a tick to ensure onAuthStateChange fires
            await new Promise((r) => setTimeout(r, 0))
            redirect('/dashboard')
          }
          return
        }
      }

      const existing = await supabase.auth.getSession()
      if (existing.data?.session?.user) {
        redirect('/dashboard')
      } else {
        redirect('/login')
      }
    }

    handleCallback().catch((err) => {
      console.error('[Auth] callback error:', err)
      redirect('/login')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <Spinner size="lg" />
    </div>
  )
}
