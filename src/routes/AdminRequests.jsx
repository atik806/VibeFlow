import { useState, useEffect } from 'react'
import { Search, Eye, Trash2, CheckCircle, Clock, FileText, Mail, DollarSign, RefreshCcw } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useOutletContext } from 'react-router-dom'
import { isSupabaseConfigured, getSupabase } from '../lib/supabaseClient'
import { getAllRequests } from '../lib/api/supabase'
import { useToast } from '../context/useToast'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { parseRequest } from '../lib/parseRequest'

const BUDGET_LABELS = {
  'under-10000': 'Under ৳10,000',
  '10000-25000': '৳10,000 – ৳25,000',
  '25000-50000': '৳25,000 – ৳50,000',
  '50000-100000': '৳50,000 – ৳1,00,000',
  '100000-plus': '৳1,00,000+',
}

export default function AdminRequests() {
  useSEO({ title: 'Admin Requests', noIndex: true })
  const { refreshKey } = useOutletContext()
  const toast = useToast()
  const [requests, setRequests] = useState(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    let cancelled = false
    getAllRequests().then((data) => {
      if (!cancelled) setRequests((data || []).map(parseRequest))
    })
    return () => { cancelled = true }
  }, [toast, refreshKey])

  async function handleRefresh() {
    if (!isSupabaseConfigured() || loading) return
    setLoading(true)
    try {
      const data = await getAllRequests()
      setRequests((data || []).map(parseRequest))
    } catch {
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatus(id, status) {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update status')
      return
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
    toast.success(`Request marked as ${status}`)
  }

  async function handleDelete(id) {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete request')
      return
    }

    setRequests((prev) => prev.filter((r) => r.id !== id))
    setSelected(null)
    toast.success('Request deleted')
  }

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <div className="admin-header-title" style={{ marginBottom: 32 }}>
          <h1>Requests</h1>
          <p>Manage incoming project requests</p>
        </div>
        <div className="admin-empty" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <div className="admin-empty-icon"><FileText size={28} /></div>
          <h3>Supabase not configured</h3>
          <p>Set up Supabase to manage requests from this dashboard.</p>
        </div>
      </div>
    )
  }

  if (requests === null) {
    return (
      <div className="admin-empty">
        <Spinner size="lg" />
      </div>
    )
  }

  const formRequests = requests.filter((r) => r._parsed)
  const filtered = formRequests.filter((r) => {
    const term = search.toLowerCase()
    return (
      String(r.id).includes(term) ||
      (r._parsed ? r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term) || r.service.toLowerCase().includes(term) : r.prompt?.toLowerCase().includes(term))
    )
  })

  return (
    <div>
      <div className="admin-header-title" style={{ marginBottom: 32 }}>
        <h1>Requests</h1>
        <p>{filtered.length} form submission{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>All Requests</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="admin-action-btn admin-action-complete"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh"
              type="button"
            >
              <RefreshCcw size={14} /> {loading ? 'Loading…' : 'Refresh'}
            </button>
            <div className="admin-table-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, email, service…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <h3>{search ? 'No matching submissions' : 'No form submissions yet'}</h3>
            <p>{search ? 'Try a different search term.' : 'Form submissions will appear here once submitted.'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => (
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
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-action-btn admin-action-complete"
                        onClick={() => setSelected(req)}
                        title="View details"
                        type="button"
                      >
                        <Eye size={14} />
                      </button>
                      {req.status !== 'completed' && (
                        <button
                          className="admin-action-btn admin-action-complete"
                          onClick={() => handleStatus(req.id, 'completed')}
                          title="Mark as completed"
                          type="button"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleDelete(req.id)}
                        title="Delete request"
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Request Details" size="md">
        {selected && (
          <div className="admin-detail">
            <div className="admin-detail-row">
              <span className="admin-detail-label">ID</span>
              <span className="admin-detail-value">#{selected.id}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Status</span>
              <span className={`admin-badge admin-badge-${selected.status === 'completed' ? 'completed' : selected.status === 'processing' ? 'processing' : 'pending'}`}>
                {selected.status}
              </span>
            </div>

            {selected._parsed ? (
              <>
                <div className="admin-detail-row">
                  <span className="admin-detail-label"><Mail size={14} style={{ marginRight: 4 }} /> Name</span>
                  <span className="admin-detail-value">{selected.name}</span>
                </div>
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Email</span>
                  <span className="admin-detail-value">{selected.email}</span>
                </div>
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Service</span>
                  <span className="admin-detail-value">{selected.service}{selected.subcategory ? ` → ${selected.subcategory}` : ''}</span>
                </div>
                <div className="admin-detail-row">
                  <span className="admin-detail-label"><DollarSign size={14} style={{ marginRight: 4 }} /> Budget</span>
                  <span className="admin-detail-value">{BUDGET_LABELS[selected.budget] || selected.budget}</span>
                </div>
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Description</span>
                  <div className="admin-detail-value">
                    <pre>{selected.description}</pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Prompt</span>
                <div className="admin-detail-value">
                  <pre>{selected.prompt}</pre>
                </div>
              </div>
            )}

            <div className="admin-detail-row">
              <span className="admin-detail-label">Created</span>
              <span className="admin-detail-value">
                {new Date(selected.created_at).toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {selected.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    handleStatus(selected.id, 'completed')
                    setSelected(null)
                  }}
                >
                  <CheckCircle size={14} /> Mark Complete
                </Button>
              )}
              {selected.status !== 'processing' && selected.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleStatus(selected.id, 'processing')
                    setSelected(null)
                  }}
                >
                  <Clock size={14} /> Start Processing
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(selected.id)}
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
