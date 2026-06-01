import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useAuth } from '../../hooks/useAuth'
import { primaryNav } from '../../data/nav'
import { LightningIcon } from '../../icons'
import { LogOut, Menu } from 'lucide-react'
import { MobileDrawer } from './MobileDrawer'
import { useEffect, useState } from 'react'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabaseClient'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const scrolled = useScrollSpy({ threshold: 24 })
  const isMobile = useMediaQuery('(max-width: 900px)')
  const drawer = useDisclosure(false)
  const isDashboard = pathname.startsWith('/dashboard')
  const [avatarEmoji, setAvatarEmoji] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setAvatarEmoji(null)
      setAvatarUrl(null)
      return
    }
    let cancelled = false
    getSupabase()
      .from('profiles')
      .select('avatar_emoji, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (cancelled || !data) return
        setAvatarEmoji(data.avatar_emoji)
        setAvatarUrl(data.avatar_url)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [user])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?'

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Primary">
        <div className="navbar-content">
          <Link to="/" className="logo" aria-label="VibeFlow home">
            <div className="logo-icon"><LightningIcon size={18} /></div>
            <span>VibeFlow</span>
          </Link>
          {!isDashboard && (
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
          )}
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-user" title="Your Dashboard">
                  <span className="nav-user-avatar">
                    {avatarUrl ? <img src={avatarUrl} alt="" />
                     : avatarEmoji ? <span className="avatar-emoji">{avatarEmoji}</span>
                     : <span>{initial}</span>}
                  </span>
                  <span className="nav-user-name">{displayName.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  className="nav-signout"
                  onClick={async () => { await signOut(); navigate('/') }}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-portal">Client Portal</Link>
            )}
          </div>
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
          user={user}
          avatarEmoji={avatarEmoji}
          avatarUrl={avatarUrl}
        />
      )}
    </>
  )
}
