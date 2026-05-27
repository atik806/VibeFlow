import { useEffect, useState, useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useSEO } from '../hooks/useSEO'
import { Spinner } from '../components/ui/Spinner'
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
} from '../icons'

const AI_FEATURES = [
  { href: '/ai-generator', icon: Sparkles, label: 'AI Image Generator', desc: 'Generate stunning images from text descriptions.' },
  { href: '/cv-with-ai', icon: FileText, label: 'CV with AI', desc: 'Create a professional resume with AI assistance.' },
  { href: '/object-detection', icon: Eye, label: 'Object Detection', desc: 'Real-time object detection with your webcam.' },
  { href: '/games', icon: Gamepad2, label: 'AI Games', desc: 'Play interactive AI-powered games.' },
  { href: '/play-with-ai', icon: Wand2, label: 'Play with AI', desc: 'Experiment with various AI tools.' },
]

const BUDGET_LABELS = {
  'under-500': 'Under $500',
  '500-1000': '$500 – $1,000',
  '1000-2500': '$1,000 – $2,500',
  '2500-5000': '$2,500 – $5,000',
  '5000+': '$5,000+',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
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
    const budgetValues = { 'under-500': 250, '500-1000': 750, '1000-2500': 1750, '2500-5000': 3750, '5000+': 6000 }
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

    return { total, active, completed, pending, topService, avgBudget, memberSince }
  }, [requests, profileCreatedAt])

  if (loading) {
    return (
      <div className="page dashboard-page">
        <div className="container page-hero">
          <div className="dashboard-loading"><Spinner /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="page dashboard-page">
      <div className="auth-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container page-hero">
        <motion.div
          className="dashboard-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-user">
            <div className="dashboard-avatar">{userInitial}</div>
            <div>
              <h1>Welcome back, {displayName}</h1>
              <p className="text-muted">{user?.email}</p>
            </div>
          </div>
          <div className="dashboard-hero-actions">
            {stats.memberSince && (
              <span className="dashboard-member-since">
                <Calendar size={14} />
                Member since {stats.memberSince}
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
          <motion.div variants={item} className="stat-card stat-total">
            <div className="stat-icon"><BarChart3 size={18} /></div>
            <div>
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Requests</span>
            </div>
          </motion.div>
          <motion.div variants={item} className="stat-card stat-active">
            <div className="stat-icon"><Activity size={18} /></div>
            <div>
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
          </motion.div>
          <motion.div variants={item} className="stat-card stat-progress">
            <div className="stat-icon"><Clock size={18} /></div>
            <div>
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </motion.div>
          <motion.div variants={item} className="stat-card stat-completed">
            <div className="stat-icon"><Sparkles size={18} /></div>
            <div>
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
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
              className="quick-action-card quick-action-request"
              onClick={openRequestModal}
              style={{ cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit', color: 'inherit' }}
            >
              <div className="quick-action-icon"><Plus size={24} /></div>
              <div>
                <h3>Submit a Request</h3>
                <p>Tell us about your project</p>
              </div>
              <ArrowRight size={18} className="quick-action-arrow" />
            </button>
          </motion.div>
          <motion.div variants={item}>
            <Link to="/services" className="quick-action-card quick-action-services">
              <div className="quick-action-icon"><Terminal size={24} /></div>
              <div>
                <h3>Browse Services</h3>
                <p>Explore what we offer</p>
              </div>
              <ArrowRight size={18} className="quick-action-arrow" />
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
                  <div className="ai-feature-card-icon"><Icon size={24} /></div>
                  <div>
                    <h3>{label}</h3>
                    <p>{desc}</p>
                  </div>
                  <ArrowRight size={18} className="ai-feature-card-arrow" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Requests</h2>
            {requests.length > 0 && (
              <span className="text-muted" style={{ fontSize: 13 }}>{stats.total} total</span>
            )}
          </div>

          {error ? (
            <div className="dashboard-empty">
              <p className="auth-error">{error}</p>
            </div>
          ) : requests.length === 0 ? (
            <motion.div
              className="dashboard-empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="dashboard-empty-icon"><Terminal size={32} /></div>
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
              {requests.slice(0, 5).map((r) => (
                <motion.div key={r.id} variants={item} className="request-card">
                  <div className="request-card-header">
                    <span className={`request-status status-${r.status}`}>{r.status}</span>
                    <span className="request-date">
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="request-service">{r.service} — {r.subcategory}</p>
                  <p className="request-desc">{r.description}</p>
                  <span className="request-budget">{BUDGET_LABELS[r.budget] || r.budget}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {requests.length > 0 && (
          <section className="dashboard-section">
            <h2>Insights</h2>
            <motion.div
              className="dashboard-insights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <div className="insight-card">
                <div className="insight-icon"><BarChart3 size={16} /></div>
                <div>
                  <span className="insight-label">Most Used Service</span>
                  <span className="insight-value">{stats.topService ? stats.topService[0] : '—'}</span>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon"><Wand2 size={16} /></div>
                <div>
                  <span className="insight-label">Average Budget</span>
                  <span className="insight-value">
                    {stats.avgBudget ? `~$${stats.avgBudget.toLocaleString()}` : '—'}
                  </span>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon"><Calendar size={16} /></div>
                <div>
                  <span className="insight-label">Member Since</span>
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
