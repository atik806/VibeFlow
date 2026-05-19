import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, Settings, LogOut, Plus } from 'lucide-react'
import { LightningIcon } from '../../icons'
import { setAdminAuthenticated } from '../../lib/adminAuth'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { href: '/admin/requests', label: 'Requests', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ open, onClose, onOpenRequestModal }) {
  const navigate = useNavigate()

  function handleLogout() {
    setAdminAuthenticated(false)
    navigate('/admin/login')
  }

  return (
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <LightningIcon size={20} />
        <span className="admin-sidebar-logo">
          <span>VibeFlow</span> Admin
        </span>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="admin-nav-item"
          onClick={() => {
            onClose?.()
            onOpenRequestModal?.()
          }}
          type="button"
          style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}
        >
          <Plus size={18} />
          Submit a Request
        </button>
        <button className="admin-logout-btn" onClick={handleLogout} type="button">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
