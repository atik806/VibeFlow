import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Field'
import { Button } from '../components/ui/Button'
import { useSEO } from '../hooks/useSEO'
import { Mail, Shield, Zap, Terminal as TerminalIcon, CheckCircle2 } from '../icons'

const codeLines = [
  { text: '> vibeflow auth --register', color: 'var(--accent-teal)', delay: 0 },
  { text: '> Generating developer profile...', color: 'var(--text-muted)', delay: 0.4 },
  { text: '> Profile scaffold ready', color: 'var(--success)', delay: 0.8 },
]

export default function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const timers = codeLines.map((line, i) =>
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), line.delay * 1000)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useSEO({ title: 'Create an Account' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) { setError('Please enter your full name.'); return }
    if (!email.trim()) { setError('Email is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Enter a valid email address.'); return }
    if (!password) { setError('Password is required.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!/[A-Z]/.test(password)) { setError('Password needs at least one uppercase letter.'); return }
    if (!/[a-z]/.test(password)) { setError('Password needs at least one lowercase letter.'); return }
    if (!/[0-9]/.test(password)) { setError('Password needs at least one number.'); return }
    if (!/[^A-Za-z0-9]/.test(password)) { setError('Password needs at least one symbol (e.g. !@#$%).'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setSubmitting(true)
    try {
      const data = await signUp(email, password, fullName)
      if (data?.session) {
        navigate('/dashboard', { replace: true })
      } else {
        setConfirmationSent(true)
      }
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="page auth-page">
        <div className="auth-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container auth-page-content">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="auth-card-header" style={{ justifyContent: 'center' }}>
              <div className="auth-card-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                <Mail size={24} />
              </div>
            </div>
            <h2 style={{ marginBottom: 8 }}>Verify Your Email</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
              We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
              Click it to activate your account.
            </p>
            <div className="auth-security-badge" style={{ justifyContent: 'center', marginTop: 8, marginBottom: 24 }}>
              <CheckCircle2 size={12} />
              <span>Check your inbox (and spam folder)</span>
            </div>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    )
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
              <h2>Create Account</h2>
              <p>Set up your developer profile to get started.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {error && <div className="auth-error" role="alert">{error}</div>}

            <Input
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
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
              placeholder="e.g. MySecurePass1!"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="password-requirements">
              <span className={`req ${/[A-Z]/.test(password) ? 'met' : ''}`}>A-Z</span>
              <span className={`req ${/[a-z]/.test(password) ? 'met' : ''}`}>a-z</span>
              <span className={`req ${/[0-9]/.test(password) ? 'met' : ''}`}>0-9</span>
              <span className={`req ${/[^A-Za-z0-9]/.test(password) ? 'met' : ''}`}>!@#$%</span>
              <span className={`req ${password.length >= 8 ? 'met' : ''}`}>8+</span>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" block loading={submitting}>
              {submitting ? 'Creating account…' : 'Create Account →'}
            </Button>
          </form>

          <p className="auth-toggle">
            Already have an account? <Link to="/login">Sign in</Link>
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
