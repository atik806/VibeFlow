import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LightningIcon } from '../icons'
import { Button } from '../components/ui/Button'
import { setAdminAuthenticated } from '../lib/adminAuth'
import { useSEO } from '../hooks/useSEO'

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'admin123'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useSEO({ title: 'Admin Login', noIndex: true })

  const from = location.state?.from?.pathname || '/admin'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 400))

    if (password === ADMIN_SECRET) {
      setAdminAuthenticated(true)
      navigate(from, { replace: true })
    } else {
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
