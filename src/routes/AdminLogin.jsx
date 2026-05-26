import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LightningIcon } from '../icons'
import { Button } from '../components/ui/Button'
import { setAdminAuthenticated } from '../lib/adminAuth'
import { useSEO } from '../hooks/useSEO'

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'admin123'
const MIN_PASSWORD_LENGTH = 1
const BASE_DELAY = 1000

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const attemptsRef = useRef(0)
  const cooldownRef = useRef(null)
  useSEO({ title: 'Admin Login', noIndex: true })

  const from = location.state?.from?.pathname || '/admin'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError('Password is required.')
      return
    }

    if (cooldownRef.current && Date.now() < cooldownRef.current) {
      const remaining = Math.ceil((cooldownRef.current - Date.now()) / 1000)
      setError(`Too many attempts. Try again in ${remaining}s.`)
      return
    }

    setLoading(true)

    let token = null
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const data = await res.json()
        token = data.token
      }
    } catch {
      /* offline — fall back to client check */
    }

    if (token || password === ADMIN_SECRET) {
      attemptsRef.current = 0
      cooldownRef.current = null
      setAdminAuthenticated(true, token)
      navigate(from, { replace: true })
    } else {
      attemptsRef.current++
      const delay = Math.min(BASE_DELAY * Math.pow(2, attemptsRef.current - 1), 30000)
      cooldownRef.current = Date.now() + delay
      setError('Invalid admin credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <LightningIcon size={24} />
        </div>
        <h1>Admin Login</h1>
        <p>Enter the admin password to access the dashboard.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-login-error">{error}</div>}

          <div className="field">
            <label className="field-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="field-control"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <Button type="submit" variant="primary" block loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
