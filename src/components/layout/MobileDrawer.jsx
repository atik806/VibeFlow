import { useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { primaryNav } from '../../data/nav'
import { LightningIcon, Close } from '../../icons'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useAuth } from '../../hooks/useAuth'

export function MobileDrawer({ isOpen, onClose, user, avatarEmoji, avatarUrl }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?'

  return createPortal(
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        id="mobile-drawer"
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="drawer-header">
          <span className="logo">
            <div className="logo-icon"><LightningIcon size={18} /></div>
            <span>VibeFlow</span>
          </span>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close navigation menu"
            type="button"
          >
            <Close size={20} />
          </button>
        </div>
        {user && (
          <div className="drawer-user">
            <span className="nav-user-avatar">
              {avatarUrl ? <img src={avatarUrl} alt="" />
               : avatarEmoji ? <span className="avatar-emoji">{avatarEmoji}</span>
               : <span>{initial}</span>}
            </span>
            <div>
              <div className="drawer-user-name">{displayName}</div>
              <div className="drawer-user-email">{user?.email}</div>
            </div>
          </div>
        )}
        {!isDashboard && (
          <nav className="drawer-nav" aria-label="Mobile primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                end={item.href === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
        <div className="drawer-footer">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-block" onClick={onClose}>
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-block"
                onClick={async () => { await signOut(); navigate('/'); onClose?.() }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline btn-block" onClick={onClose}>
              Client Portal
            </Link>
          )}
        </div>
      </aside>
    </>,
    document.body
  )
}
