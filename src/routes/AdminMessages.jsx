import { useState } from 'react'
import { Search, Mail, Trash2 } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useToast } from '../context/useToast'
import { Modal } from '../components/ui/Modal'

const SAMPLE_MESSAGES = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    subject: 'Partnership inquiry',
    message: 'Hi VibeFlow team, I would love to discuss a potential partnership opportunity. We are a design agency looking for a reliable development partner. Looking forward to hearing from you.',
    created_at: '2026-05-18T10:30:00Z',
    read: false,
  },
  {
    id: 2,
    name: 'James Chen',
    email: 'james@example.com',
    subject: 'Urgent project request',
    message: 'Need a complete website redesign within 2 weeks. We have about 15 pages and need both design and development. Is this something you can handle on a tight timeline?',
    created_at: '2026-05-17T14:20:00Z',
    read: true,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    subject: 'Question about pricing',
    message: 'I am interested in the Pro plan but I wanted to ask about custom add-ons. Do you offer SEO optimization as part of the package or is that an extra? Thanks!',
    created_at: '2026-05-16T09:15:00Z',
    read: true,
  },
]

export default function AdminMessages() {
  useSEO({ title: 'Admin Messages', noIndex: true })
  const toast = useToast()
  const [messages, setMessages] = useState(SAMPLE_MESSAGES)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id) {
    setMessages((prev) => prev.filter((m) => m.id !== id))
    setSelected(null)
    toast.success('Message deleted')
  }

  function handleMarkRead(id) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    )
  }

  return (
    <div>
      <div className="admin-header-title" style={{ marginBottom: 32 }}>
        <h1>Messages</h1>
        <p>Contact form submissions and inquiries</p>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>Inbox ({filtered.length})</h2>
          <div className="admin-table-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon"><Mail size={28} /></div>
            <h3>{search ? 'No matching messages' : 'No messages yet'}</h3>
            <p>{search ? 'Try a different search term.' : 'Contact form submissions will appear here.'}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((msg) => (
                <tr
                  key={msg.id}
                  style={{ fontWeight: msg.read ? 'normal' : 600 }}
                >
                  <td>
                    <div>{msg.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{msg.email}</div>
                  </td>
                  <td>{msg.subject}</td>
                  <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-action-btn admin-action-complete"
                        onClick={() => {
                          setSelected(msg)
                          if (!msg.read) handleMarkRead(msg.id)
                        }}
                        title="View message"
                        type="button"
                      >
                        <Mail size={14} /> View
                      </button>
                      <button
                        className="admin-action-btn admin-action-delete"
                        onClick={() => handleDelete(msg.id)}
                        title="Delete message"
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details" size="md">
        {selected && (
          <div className="admin-detail">
            <div className="admin-detail-row">
              <span className="admin-detail-label">From</span>
              <span className="admin-detail-value">{selected.name}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Email</span>
              <span className="admin-detail-value">{selected.email}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Subject</span>
              <span className="admin-detail-value">{selected.subject}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Message</span>
              <div className="admin-detail-value">
                <pre>{selected.message}</pre>
              </div>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Received</span>
              <span className="admin-detail-value">
                {new Date(selected.created_at).toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                className="admin-action-btn admin-action-delete"
                onClick={() => handleDelete(selected.id)}
                type="button"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
