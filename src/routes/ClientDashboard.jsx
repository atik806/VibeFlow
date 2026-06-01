import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useSEO } from '../hooks/useSEO'
import { useToast } from '../context/useToast'
import { getSupabase, isSupabaseConfigured } from '../lib/supabaseClient'
import {
  Sparkles, FileText, Gamepad2, Eye, Map,
  ArrowRight, Calendar, BarChart3,
  Plus, Terminal, Mail, DollarSign,
  LayoutDashboard, List, MessageSquare, User,
  Lock, Send, Search, Trash2,
  CheckCircle2, AlertCircle, Loader2,
} from '../icons'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'My Projects', icon: List },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
]

const AI_FEATURES = [
  { href: '/ai-generator', icon: Sparkles, label: 'AI Image Generator', desc: 'Generate images from text' },
  { href: '/cv-with-ai', icon: FileText, label: 'CV with AI', desc: 'Build a professional resume' },
  { href: '/object-detection', icon: Eye, label: 'Object Detection', desc: 'Real-time object detection' },
  { href: '/games', icon: Gamepad2, label: 'AI Games', desc: 'Interactive AI-powered games' },
  { href: '/map-poster', icon: Map, label: 'Map Poster', desc: 'Design custom map posters' },
]

const BUDGET_LABELS = {
  'under-10000': '<\u09F310k',
  '10000-25000': '\u09F310k\u201325k',
  '25000-50000': '\u09F325k\u201350k',
  '50000-100000': '\u09F350k\u20131L',
  '100000-plus': '\u09F31L+',
}

const STATUS_LABELS = {
  'new': 'Pending', 'pending': 'Pending', 'contacted': 'Contacted',
  'in-progress': 'In Progress', 'completed': 'Completed', 'cancelled': 'Cancelled',
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

/* ─── Overview Tab ─── */
function OverviewTab({ stats, recentRequests, error, openRequestModal }) {
  return (
    <>
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
          <span className="stat-value" style={{ color: 'var(--accent-teal)' }}>{stats.active}</span>
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
            <button type="button" className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => window.location.reload()}>
              Retry
            </button>
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
                  <div className="request-service">{r.service || 'General inquiry'}</div>
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
                <span className="insight-value">{stats.topService ? stats.topService[0] : '\u2014'}</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon"><DollarSign size={14} /></div>
              <div>
                <span className="insight-label">Average budget</span>
                <span className="insight-value">
                  {stats.avgBudget ? `~\u09F3${stats.avgBudget.toLocaleString()}` : '\u2014'}
                </span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon"><Calendar size={14} /></div>
              <div>
                <span className="insight-label">Member since</span>
                <span className="insight-value">{stats.memberSince || '\u2014'}</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </>
  )
}

/* ─── Projects Tab ─── */
function ProjectsTab({ requests, loading }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = requests
    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        (r.service || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.subcategory || '').toLowerCase().includes(q)
      )
    }
    return result
  }, [requests, statusFilter, searchQuery])

  const statusCounts = useMemo(() => {
    const counts = { all: requests.length }
    requests.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1
    })
    return counts
  }, [requests])

  if (loading) {
    return <div className="dashboard-loading"><Loader2 size={24} className="spinner" /></div>
  }

  return (
    <div className="dashboard-section">
      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={14} className="projects-search-icon" />
          <input
            type="text"
            className="projects-search-input"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="projects-filters">
          {['all', 'new', 'contacted', 'in-progress', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              type="button"
              className={`projects-filter-btn ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_LABELS[s] || s}
              {statusCounts[s] > 0 && <span className="projects-filter-count">{statusCounts[s]}</span>}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon"><List size={22} /></div>
          <h3>{requests.length === 0 ? 'No requests yet' : 'No matching requests'}</h3>
          <p>{requests.length === 0 ? 'Submit your first project request to get started.' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <motion.div
          className="requests-list"
          variants={container}
          initial="hidden"
          animate="show"
          key={statusFilter + searchQuery}
        >
          {filtered.map((r) => (
            <motion.div key={r.id} variants={item} className="request-card">
              <div className="request-card-main">
                <div className="request-card-meta">
                  <span className={`request-status status-${r.status}`}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                  <span className="request-date">
                    {new Date(r.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="request-service">{r.service || 'General inquiry'}</div>
                {r.subcategory && <div className="request-subcategory">{r.subcategory}</div>}
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
    </div>
  )
}

/* ─── Messages Tab ─── */
function MessagesTab({ user }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMsg, setNewMsg] = useState({ subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const toast = useToast()

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (!user || !isSupabaseConfigured()) {
        if (!cancelled) setLoading(false)
        return
      }
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('client_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (!cancelled) {
        if (!error) setMessages(data || [])
        setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [user])

  const handleSend = useCallback(async (e) => {
    e.preventDefault()
    if (!newMsg.subject.trim() || !newMsg.message.trim()) return
    if (!isSupabaseConfigured()) return
    setSending(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('client_messages')
        .insert({
          user_id: user.id,
          sender: 'client',
          subject: newMsg.subject.trim(),
          message: newMsg.message.trim(),
          read: false,
        })
      if (error) throw error
      toast.success('Message sent', 'We\'ll get back to you soon.')
      setNewMsg({ subject: '', message: '' })
      // Refresh
      const { data } = await supabase
        .from('client_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setMessages(data)
    } catch (err) {
      toast.error('Failed to send', err.message)
    }
    setSending(false)
  }, [newMsg, user, toast])

  if (loading) {
    return <div className="dashboard-loading"><Loader2 size={24} className="spinner" /></div>
  }

  return (
    <div className="dashboard-section">
      {/* New message form */}
      <div className="msg-compose">
        <h3 className="msg-compose-title">Send a Message</h3>
        <form onSubmit={handleSend} className="msg-compose-form">
          <input
            type="text"
            className="field-control"
            placeholder="Subject"
            value={newMsg.subject}
            onChange={e => setNewMsg(p => ({ ...p, subject: e.target.value }))}
            required
          />
          <textarea
            className="field-control msg-compose-textarea"
            placeholder="Write your message..."
            rows={3}
            value={newMsg.message}
            onChange={e => setNewMsg(p => ({ ...p, message: e.target.value }))}
            required
          />
          <Button type="submit" variant="primary" loading={sending} disabled={sending}>
            <Send size={14} />
            Send Message
          </Button>
        </form>
      </div>

      {/* Message history */}
      <div className="dashboard-section-header" style={{ marginTop: 28 }}>
        <h2>Message History</h2>
        {messages.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{messages.length} total</span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon"><MessageSquare size={22} /></div>
          <h3>No messages yet</h3>
          <p>Send a message to start a conversation with our team.</p>
        </div>
      ) : (
        <div className="msg-list">
          {messages.map((m) => (
            <div key={m.id} className={`msg-item ${!m.read && m.sender === 'admin' ? 'msg-unread' : ''}`}>
              <div className="msg-item-header">
                <span className="msg-item-sender">
                  {m.sender === 'admin' ? 'VibeFlow Team' : 'You'}
                </span>
                <span className="msg-item-date">
                  {new Date(m.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="msg-item-subject">{m.subject}</div>
              <div className="msg-item-body">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Profile Tab ─── */
function ProfileTab({ user }) {
  const [profile, setProfile] = useState({ full_name: '', phone: '', company: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (!user || !isSupabaseConfigured()) {
        if (!cancelled) setLoading(false)
        return
      }
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, company')
        .eq('id', user.id)
        .single()
      if (!cancelled) {
        if (!error && data) {
          setProfile({
            full_name: data.full_name || '',
            phone: data.phone || '',
            company: data.company || '',
          })
        }
        setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [user])

  const handleSave = useCallback(async (e) => {
    e.preventDefault()
    if (!isSupabaseConfigured()) return
    setSaving(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profile.full_name,
          phone: profile.phone,
          company: profile.company,
        })
      if (error) throw error
      toast.success('Profile updated', 'Your changes have been saved.')
    } catch (err) {
      toast.error('Failed to save', err.message)
    }
    setSaving(false)
  }, [user, profile, toast])

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')

    if (pwForm.new.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwError('Passwords do not match.')
      return
    }
    if (!isSupabaseConfigured()) return

    setPwLoading(true)
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.updateUser({ password: pwForm.new })
      if (error) throw error
      setPwSuccess('Password updated successfully.')
      setPwForm({ current: '', new: '', confirm: '' })
    } catch (err) {
      setPwError(err.message)
    }
    setPwLoading(false)
  }, [pwForm])

  const handleDeleteAccount = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    if (!isSupabaseConfigured()) return
    try {
      const supabase = getSupabase()
      // Delete profile first
      await supabase.from('profiles').delete().eq('id', user.id)
      // Sign out
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (err) {
      toast.error('Failed to delete account', err.message)
    }
  }, [user, toast])

  if (loading) {
    return <div className="dashboard-loading"><Loader2 size={24} className="spinner" /></div>
  }

  return (
    <div className="dashboard-section profile-section">
      <div className="profile-card">
        <h3 className="profile-card-title">Personal Information</h3>
        <form onSubmit={handleSave} className="profile-form">
          <Input
            label="Full Name"
            value={profile.full_name}
            onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
            placeholder="Your full name"
          />
          <div className="field">
            <label className="field-label">Email</label>
            <div className="field-authenticated-info">{user?.email}</div>
          </div>
          <Input
            label="Phone"
            value={profile.phone}
            onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
            placeholder="+880 1XXX-XXXXXX"
            hint="Optional. Used for project updates."
          />
          <Input
            label="Company"
            value={profile.company}
            onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
            placeholder="Your company or organization"
            hint="Optional."
          />
          <div className="profile-form-actions">
            <Button type="submit" variant="primary" loading={saving}>
              <CheckCircle2 size={14} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="profile-card">
        <h3 className="profile-card-title">Change Password</h3>
        <form onSubmit={handleChangePassword} className="profile-form">
          <Input
            label="New Password"
            type="password"
            value={pwForm.new}
            onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))}
            placeholder="Enter new password"
            hint="At least 6 characters."
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={pwForm.confirm}
            onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
            placeholder="Confirm new password"
          />
          {pwError && <p className="field-error"><AlertCircle size={14} />{pwError}</p>}
          {pwSuccess && <p className="field-success"><CheckCircle2 size={14} />{pwSuccess}</p>}
          <div className="profile-form-actions">
            <Button type="submit" variant="primary" loading={pwLoading}>
              <Lock size={14} />
              Update Password
            </Button>
          </div>
        </form>
      </div>

      <div className="profile-card profile-card-danger">
        <h3 className="profile-card-title">Danger Zone</h3>
        <p className="profile-card-desc">Permanently delete your account and all associated data.</p>
        <Button type="button" variant="ghost" className="btn btn-danger" onClick={handleDeleteAccount}>
          <Trash2 size={14} />
          Delete Account
        </Button>
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─── */
export default function ClientDashboard() {
  const { user } = useAuth()
  const outletCtx = useOutletContext() || {}
  const { openRequestModal, refreshKey } = outletCtx
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const [requests, setRequests] = useState([])
  const [profileCreatedAt, setProfileCreatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useSEO({ title: 'Dashboard' })

  const setTab = useCallback((tab) => {
    setSearchParams(tab === 'overview' ? {} : { tab })
  }, [setSearchParams])

  useEffect(() => {
    if (!user) return
    let cancelled = false

    const load = async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) setLoading(false)
        return
      }

      const supabase = getSupabase()
      const errs = []

      try {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existing) {
          const email = user.email || ''
          const fullName = user.user_metadata?.full_name || email.split('@')[0] || 'User'
          await supabase
            .from('profiles')
            .insert({ id: user.id, email, full_name: fullName })
            .single()
        }
      } catch (err) {
        console.warn('[Dashboard] Profile check/create failed:', err.message)
      }

      const reqByIdPromise = supabase
        .from('project_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      const reqByEmailPromise = user.email
        ? supabase
            .from('project_requests')
            .select('*')
            .ilike('email', user.email.replace(/[%_]/g, '\\$&'))
            .order('created_at', { ascending: false })
            .limit(50)
        : Promise.resolve({ data: null, error: null })

      const [reqById, reqByEmail, legacyReqs, profResult] = await Promise.all([
        reqByIdPromise,
        reqByEmailPromise,
        supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('profiles')
          .select('full_name, phone, company, created_at')
          .eq('id', user.id)
          .single(),
      ])

      if (reqById.error) errs.push('user_id query')
      if (reqByEmail && reqByEmail.error) errs.push('email query')

      const seen = new Set()
      const userRequests = []

      for (const r of [...(reqById.data || []), ...(reqByEmail.data || [])]) {
        if (seen.has(r.id)) continue
        seen.add(r.id)
        userRequests.push(r)
      }

      const userEmail = user.email?.toLowerCase().trim()
      if (userEmail) {
        for (const r of legacyReqs.data || []) {
          let parsed
          try {
            parsed = typeof r.prompt === 'string' ? JSON.parse(r.prompt) : r.prompt
          } catch {
            parsed = {}
          }
          const entryEmail = (parsed.email || '').toLowerCase().trim()
          if (entryEmail !== userEmail) continue
          const legacyId = `legacy-${r.id}`
          if (seen.has(legacyId)) continue
          seen.add(legacyId)
          userRequests.push({
            id: legacyId,
            user_id: parsed.user_id || user.id,
            email: parsed.email || user.email,
            service: parsed.service || '',
            subcategory: parsed.subcategory || '',
            description: parsed.description || '',
            budget: parsed.budget || '',
            status: r.status === 'pending' ? 'new' : r.status,
            created_at: r.created_at,
          })
        }
      }

      userRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      if (!cancelled) {
        setError(errs.length > 0 ? `Could not fetch from: ${errs.join(', ')}` : '')
        setRequests(userRequests)
        if (!profResult.error && profResult.data?.created_at) {
          setProfileCreatedAt(profResult.data.created_at)
        }
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user, refreshKey])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userInitial = displayName.charAt(0).toUpperCase()

  const stats = useMemo(() => {
    const total = requests.length
    const active = requests.filter((r) => r.status === 'contacted' || r.status === 'in-progress').length
    const completed = requests.filter((r) => r.status === 'completed').length
    const pending = requests.filter((r) => r.status === 'new' || r.status === 'pending').length

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

      {/* Tab navigation */}
      <div className="container">
        <nav className="dashboard-tabs" role="tablist">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              className={`dashboard-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            {...fade}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                stats={stats}
                recentRequests={recentRequests}
                error={error}
                openRequestModal={openRequestModal}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab
                requests={requests}
                loading={loading}
              />
            )}
            {activeTab === 'messages' && <MessagesTab user={user} />}
            {activeTab === 'profile' && <ProfileTab user={user} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
