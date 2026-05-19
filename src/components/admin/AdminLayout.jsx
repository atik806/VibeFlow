import { Outlet } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { useDisclosure } from '../../hooks/useDisclosure'
import { RequestModal } from '../modals/RequestModal'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const requestModal = useDisclosure(false)
  const supabaseConnected = isSupabaseConfigured()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRequestSubmitted = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const handleRequestModalClose = useCallback(() => {
    requestModal.close()
  }, [requestModal])

  return (
    <div className="admin-layout">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenRequestModal={requestModal.open}
      />

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              type="button"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className="admin-header-right">
            <div className="admin-header-actions">
              <span
                className={`admin-status-dot ${supabaseConnected ? 'connected' : 'disconnected'}`}
                aria-hidden="true"
              />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {supabaseConnected ? 'Supabase Connected' : 'Supabase Disconnected'}
              </span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet context={{ openRequestModal: requestModal.open, refreshKey }} />
        </main>
      </div>

      <RequestModal
        isOpen={requestModal.isOpen}
        onClose={handleRequestModalClose}
        onSubmitted={handleRequestSubmitted}
      />
    </div>
  )
}
