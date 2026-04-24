import { NavLink, Link } from 'react-router-dom'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { primaryNav } from '../../data/nav'
import { LightningIcon } from '../../icons'
import { Menu } from '../../icons'
import { MobileDrawer } from './MobileDrawer'

export function Navbar({ onOpenRequestModal }) {
  const scrolled = useScrollSpy({ threshold: 24 })
  const isMobile = useMediaQuery('(max-width: 900px)')
  const drawer = useDisclosure(false)

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <div className="navbar-content">
          <Link to="/" className="logo" aria-label="Vibe Flow home">
            <div className="logo-icon"><LightningIcon size={18} /></div>
            <span>Vibe Flow</span>
          </Link>
          <div className="nav-links">
            {primaryNav.slice(1).map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                end={item.href === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <button
            className="nav-cta"
            onClick={onOpenRequestModal}
            type="button"
          >
            Submit a Request
          </button>
          <button
            className="mobile-menu-btn"
            onClick={drawer.open}
            aria-label="Open navigation menu"
            aria-expanded={drawer.isOpen}
            aria-controls="mobile-drawer"
            type="button"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>
      {isMobile && (
        <MobileDrawer
          isOpen={drawer.isOpen}
          onClose={drawer.close}
          onOpenRequestModal={() => {
            drawer.close()
            onOpenRequestModal?.()
          }}
        />
      )}
    </>
  )
}
