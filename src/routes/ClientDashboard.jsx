import { useEffect, useState, useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useSEO } from '../hooks/useSEO'
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient'
import {
  Sparkles,
  FileText,
  Gamepad2,
  Eye,
  Wand2,
  ArrowRight,
  Calendar,
  Activity,
  Clock,
  BarChart3,
  Plus,
  Terminal,
  Mail,
  DollarSign,
} from '../icons'

const AI_FEATURES = [
  { href: '/ai-generator', icon: Sparkles, label: 'AI Image Generator', desc: 'Generate images from text' },
  { href: '/cv-with-ai', icon: FileText, label: 'CV with AI', desc: 'Build a professional resume' },
  { href: '/object-detection', icon: Eye, label: 'Object Detection', desc: 'Real-time object detection' },
  { href: '/games', icon: Gamepad2, label: 'AI Games', desc: 'Interactive AI-powered games' },
  { href: '/play-with-ai', icon: Wand2, label: 'Play with AI', desc: 'Experiment with AI tools' },
]

const BUDGET_LABELS = {
  'under-10000': '<৳10k',
  '10000-25000': '৳10k–25k',
  '25000-50000': '৳25k–50k',
  '50000-100000': '৳50k–1L',
  '100000-plus': '৳1L+',
}

const STATUS_LABELS = {
  'new': 'Pending',
  'contacted': 'Contacted',
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const { openRequestModal } = useOutletContext()
  const [requests, setRequests] = useState([])
  const [profileCreatedAt, setProfileCreatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useSEO({ title: 'Dashboard' })

  useEffect(() => {
    if (!user) return

    const load = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false)
        return
      }

      const supabase = getSupabase()

      const [reqResult, profResult] = await Promise.all([
        supabase
          .from('project_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single(),
      ])

      if (reqResult.error) {
        setError('Could not load your requests.')
        console.error('[Dashboard] Failed to fetch requests:', reqResult.error)
      } else if (reqResult.data) {
        setRequests(reqResult.data)
      }

      if (!profResult.error && profResult.data?.created_at) {
        setProfileCreatedAt(profResult.data.created_at)
      }

      setLoading(false)
    }

    load()
  }, [user])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userInitial = displayName.charAt(0).toUpperCase()

  const stats = useMemo(() => {
    const total = requests.length
    const active = requests.filter((r) => r.status === 'contacted' || r.status === 'in-progress').length
    const completed = requests.filter((r) => r.status === 'completed').length
    const pending = requests.filter((r) => r.status === 'new').length

    const serviceCounts = {}
    let budgetTotal = 0
    let budgetCount = 0
    const budgetValues = { 'under-10000': 5000, '10000-25000': 17500, '25000-50000': 37500, '50000-100000': 75000, '100000-plus': 150000 }
    requests.forEach((r) => {
      serviceCounts[r.service] = (serviceCounts[r.service] || 0) + 1
      const val = budgetValues[r.budget]
      if (val) { budgetTotal += val; budgetCount++ }
    })
    const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]
    const avgBudget = budgetCount > 0 ? Math.round(budgetTotal / budgetCount) : null

    const memberSince = profileCreatedAt
      ? new Date(profileCreatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : null

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, active, completed, pending, topService, avgBudget, memberSince, completionRate }
  }, [requests, profileCreatedAt])

  const recentRequests = requests.slice(0, 5)

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="container page-hero" style={{ paddingBottom: 0 }}>
          <div className="dashboard-skeleton">
            <div className="skel-row">
              <div className="skel-block" />
              <div className="skel-block" />
              <div className="skel-block" />
              <div className="skel-block" />
            </div>
            <div className="skel-block-sm" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="skel-block-md" />
              <div className="skel-block-md" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page dashboard-page">
      <div className="container page-hero">
        <motion.div
          className="dashboard-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="dashboard-user">
            <div className="dashboard-avatar">{userInitial}</div>
            <div>
              <h1>{displayName}</h1>
              <p className="text-muted">{user?.email}</p>
            </div>
          </div>
          <div className="dashboard-hero-actions">
            {stats.memberSince && (
              <span className="dashboard-member-since">
                <Calendar size={13} />
                {stats.memberSince}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="container">
        <motion.div
          className="dashboard-stats"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="stat-card">
            <span className="stat-value" style={{ color: 'var(--accent-purple)' }}>{stats.total}</span>
            <span className="stat-label">Total requests</span>
          </motion.div>
          <motion.div variants={item} className="stat-card">
            <span className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</span>
            <span className="stat-label">Pending</span>
            <span className="stat-trend">{stats.pending > 0 ? 'Awaiting review' : 'All clear'}</span>
          </motion.div>
          <motion.div variants={item} className="stat-card">
            <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{stats.active}</span>
            <span className="stat-label">In progress</span>
            <span className="stat-trend">{stats.active > 0 ? `${stats.active} active` : 'None active'}</span>
          </motion.div>
          <motion.div variants={item} className="stat-card">
            <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.completed}</span>
            <span className="stat-label">Completed</span>
            <span className="stat-trend">{stats.completionRate}% completion rate</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="dashboard-quick-actions"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <button
              type="button"
              className="quick-action-card"
              onClick={openRequestModal}
              style={{ cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
            >
              <div className="quick-action-icon"><Plus size={20} /></div>
              <div>
                <h3>Submit a Request</h3>
                <p>Tell us about your project</p>
              </div>
              <ArrowRight size={16} className="quick-action-arrow" />
            </button>
          </motion.div>
          <motion.div variants={item}>
            <Link to="/services" className="quick-action-card">
              <div className="quick-action-icon"><Terminal size={20} /></div>
              <div>
                <h3>Browse Services</h3>
                <p>Explore what we offer</p>
              </div>
              <ArrowRight size={16} className="quick-action-arrow" />
            </Link>
          </motion.div>
        </motion.div>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>AI Tools</h2>
          </div>
          <motion.div
            className="ai-features-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {AI_FEATURES.map(({ href, icon: Icon, label, desc }) => (
              <motion.div key={href} variants={item}>
                <Link to={href} className="ai-feature-card">
                  <div className="ai-feature-card-icon"><Icon size={18} /></div>
                  <div>
                    <h3>{label}</h3>
                    <p>{desc}</p>
                  </div>
                  <ArrowRight size={14} className="ai-feature-card-arrow" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Requests</h2>
            {recentRequests.length > 0 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stats.total} total</span>
            )}
          </div>

          {error ? (
            <div className="dashboard-empty">
              <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>
            </div>
          ) : recentRequests.length === 0 ? (
            <motion.div
              className="dashboard-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="dashboard-empty-icon"><Mail size={22} /></div>
              <h3>No requests yet</h3>
              <p>Submit your first project request to get started.</p>
              <button type="button" className="btn btn-primary" onClick={openRequestModal}>Submit a Request</button>
            </motion.div>
          ) : (
            <motion.div
              className="requests-list"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {recentRequests.map((r) => (
                <motion.div key={r.id} variants={item} className="request-card">
                  <div className="request-card-main">
                    <div className="request-card-meta">
                      <span className={`request-status status-${r.status}`}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                      <span className="request-date">
                        {new Date(r.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="request-service">{r.service}</div>
                    {r.description && <div className="request-desc">{r.description}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    {r.budget && (
                      <span className="request-budget">
                        <DollarSign size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 1 }} />
                        {BUDGET_LABELS[r.budget] || r.budget}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {recentRequests.length > 0 && (
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Insights</h2>
            </div>
            <motion.div
              className="dashboard-insights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="insight-card">
                <div className="insight-icon"><BarChart3 size={14} /></div>
                <div>
                  <span className="insight-label">Most used service</span>
                  <span className="insight-value">{stats.topService ? stats.topService[0] : '—'}</span>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon"><DollarSign size={14} /></div>
                <div>
                  <span className="insight-label">Average budget</span>
                  <span className="insight-value">
                    {stats.avgBudget ? `~৳${stats.avgBudget.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon"><Calendar size={14} /></div>
                <div>
                  <span className="insight-label">Member since</span>
                  <span className="insight-value">{stats.memberSince || '—'}</span>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  )
}
