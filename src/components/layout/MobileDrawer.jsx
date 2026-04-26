import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { primaryNav } from '../../data/nav'
import { LightningIcon, Close } from '../../icons'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { Button } from '../ui/Button'

export function MobileDrawer({ isOpen, onClose, onOpenRequestModal }) {
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
        <div className="drawer-footer">
          <Button variant="primary" block onClick={onOpenRequestModal}>
            Submit a Request
          </Button>
        </div>
      </aside>
    </>,
    document.body
  )
}
