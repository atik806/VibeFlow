import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { OAuthProviders } from '../components/auth/OAuthProviders'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { useSEO } from '../hooks/useSEO'
import { Zap, Shield, Terminal as TerminalIcon } from '../icons'

const codeLines = [
  { text: '> vibeflow auth --login', color: 'var(--accent-teal)', delay: 0 },
  { text: '> Initializing secure session...', color: 'var(--text-muted)', delay: 0.4 },
  { text: '> Connection established via 256-bit TLS', color: 'var(--success)', delay: 0.8 },
]

export default function LoginPage() {
  const { signIn, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const authConfigured = isSupabaseConfigured()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [oauthProvider, setOauthProvider] = useState(null)
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timers = codeLines.map((line, i) =>
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), line.delay * 1000)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useSEO({ title: 'Client Portal Login' })

  function validate() {
    if (!email.trim()) return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.'
    if (!password) return 'Password is required.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
        setError('Email not confirmed. Check your inbox for the confirmation link, or sign up again to resend it.')
      } else if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. If you haven\'t signed up yet, create an account first.')
      } else {
        setError(msg || 'Invalid email or password.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleOAuthSignIn = async (provider) => {
    if (!authConfigured) {
      setError('Auth is not configured. Set Supabase environment variables.')
      return
    }
    setError('')
    setOauthProvider(provider)
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError(err.message || `Could not sign in with ${provider}.`)
      setOauthProvider(null)
    }
  }

  return (
    <div className="page auth-page">
      <div className="auth-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container auth-page-content">
        <div className="auth-terminal-header">
          <div className="auth-terminal-dots">
            <span /><span /><span />
          </div>
          <div className="auth-terminal-code">
            {codeLines.map((line, i) => (
              <motion.p
                key={i}
                className="auth-code-line"
                initial={{ opacity: 0, x: -8 }}
                animate={visibleLines > i ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <span className="auth-code-prompt"><Zap size={12} /></span>
                <span style={{ color: line.color }}>{line.text}</span>
              </motion.p>
            ))}
            {visibleLines >= codeLines.length && (
              <motion.p
                className="auth-code-line"
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              >
                <span className="auth-code-prompt"><Zap size={12} /></span>
                <span style={{ color: 'var(--text-muted)' }}>_</span>
              </motion.p>
            )}
          </div>
        </div>

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
        >
          <div className="auth-card-header">
            <div className="auth-card-icon"><TerminalIcon size={20} /></div>
            <div>
              <h2>Sign In</h2>
              <p>Enter your credentials to access the portal.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {!authConfigured && (
              <div className="auth-error" role="alert">
                Auth is not configured. Set Supabase environment variables on Vercel, then redeploy.
              </div>
            )}
            {error && <div className="auth-error" role="alert">{error}</div>}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" block loading={submitting}>
              {submitting ? 'Authenticating…' : 'Sign In →'}
            </Button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <OAuthProviders
            onOAuth={handleOAuthSignIn}
            disabled={!authConfigured}
            loadingProvider={oauthProvider}
          />

          <p className="auth-toggle">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>

          <div className="auth-security-badge">
            <Shield size={12} />
            <span>Encrypted connection · Secured by Supabase Auth</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
