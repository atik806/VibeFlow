import { useState, useEffect, useCallback } from 'react'
import { FileText, CheckCircle2, Clock, Activity, RefreshCcw, Users } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { getAdminToken } from '../lib/adminAuth'
import { getAllRequests } from '../lib/api/supabase'
import { Spinner } from '../components/ui/Spinner'
import { parseRequest } from '../lib/parseRequest'

function fetchVisitors() {
  const token = getAdminToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch('/api/visitors', { headers }).then((r) => {
    if (!r.ok) throw new Error(r.statusText)
    return r.json()
  })
}

export default function AdminDashboard() {
  useSEO({ title: 'Admin Dashboard', noIndex: true })
  const { refreshKey } = useOutletContext()
  const [requests, setRequests] = useState(null)
  const [visitors, setVisitors] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    let cancelled = false
    getAllRequests().then((data) => {
      if (!cancelled) setRequests((data || []).map(parseRequest))
    })
    return () => { cancelled = true }
  }, [refreshKey])

  useEffect(() => {
    fetchVisitors().then((d) => setVisitors(d)).catch(() => {})
    const interval = setInterval(() => {
      fetchVisitors().then((d) => setVisitors(d)).catch(() => {})
    }, 15_000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = useCallback(() => {
    if (!isSupabaseConfigured()) return
    getAllRequests().then((data) => setRequests((data || []).map(parseRequest)))
  }, [])

  if (requests === null && isSupabaseConfigured()) {
    return (
      <div className="admin-empty">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <div className="admin-header-title" style={{ marginBottom: 32 }}>
          <h1>Dashboard</h1>
          <p>Overview of your VibeFlow admin panel</p>
        </div>

        <div className="admin-empty" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <div className="admin-empty-icon">
            <Activity size={28} />
          </div>
          <h3>Supabase not configured</h3>
          <p>
            Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
            to connect your database and view request data.
          </p>
        </div>
      </div>
    )
  }

  const online = visitors?.online ?? null
  const recentPaths = (visitors?.sessions || []).slice(0, 5)

  const formRequests = requests.filter((r) => r._parsed)
  const total = formRequests.length
  const pending = formRequests.filter((r) => r.status === 'pending').length
  const completed = formRequests.filter((r) => r.status === 'completed').length
  const processing = formRequests.filter((r) => r.status === 'processing').length

  const stats = [
    {
      label: 'Online Now',
      value: online !== null ? online : '…',
      icon: Users,
      color: 'cyan',
    },
    {
      label: 'Total Requests',
      value: total,
      icon: FileText,
      color: 'purple',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'orange',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Processing',
      value: processing,
      icon: Activity,
      color: 'cyan',
    },
  ]

  return (
    <div>
      <div className="admin-header-title" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your request pipeline</p>
        </div>
        <button
          className="admin-action-btn admin-action-complete"
          onClick={handleRefresh}
          title="Refresh"
          type="button"
        >
          <RefreshCcw size={14} /> Refresh
        </button>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <div className={`admin-stat-icon ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {online !== null && online > 0 && (
        <div className="admin-activity-card" style={{ marginBottom: 20, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={16} style={{ color: 'var(--success)' }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Active on site</span>
          </div>
          {recentPaths.map((s) => (
            <div key={s.session_id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '2px 0' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              <span style={{ color: 'var(--text-muted)' }}>{s.page_path}</span>
            </div>
          ))}
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>Recent Requests</h2>
        </div>
        {formRequests.length === 0 ? (
          <div className="admin-empty">
            <h3>No form submissions yet</h3>
            <p>Requests submitted through the site will appear here.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {formRequests.slice(0, 10).map((req) => (
                <tr key={req.id}>
                  <td>
                    <div>{req._parsed ? req.name : `#${req.id}`}</div>
                    {req._parsed && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{req.email}</div>}
                  </td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {req._parsed ? req.service : req.prompt}
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge-${req.status === 'completed' ? 'completed' : req.status === 'processing' ? 'processing' : 'pending'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
