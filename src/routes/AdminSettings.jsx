import { useSEO } from '../hooks/useSEO'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { env } from '../lib/env'

export default function AdminSettings() {
  useSEO({ title: 'Admin Settings', noIndex: true })

  const supabaseConfigured = isSupabaseConfigured()

  return (
    <div>
      <div className="admin-header-title" style={{ marginBottom: 32 }}>
        <h1>Settings</h1>
        <p>Manage your admin panel configuration</p>
      </div>

      <div className="admin-settings-section">
        <h2>Supabase</h2>
        <p>Database connection status and configuration.</p>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">Status</div>
            <div className="admin-settings-row-desc">Supabase client connection</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className={`admin-status-dot ${supabaseConfigured ? 'connected' : 'disconnected'}`}
            />
            <span style={{ fontSize: 13, color: supabaseConfigured ? 'var(--success)' : 'var(--danger)' }}>
              {supabaseConfigured ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">URL</div>
            <div className="admin-settings-row-desc">Supabase project URL</div>
          </div>
          <span className="admin-settings-row-value">
            {env.VITE_SUPABASE_URL || 'Not set'}
          </span>
        </div>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">Anon Key</div>
            <div className="admin-settings-row-desc">Public anon/publishable key</div>
          </div>
          <span className="admin-settings-row-value">
            {supabaseConfigured ? '********' : 'Not set'}
          </span>
        </div>
      </div>

      <div className="admin-settings-section">
        <h2>Site</h2>
        <p>General site configuration.</p>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">Brand Name</div>
            <div className="admin-settings-row-desc">The brand name used throughout the site</div>
          </div>
          <span className="admin-settings-row-value">{env.VITE_BRAND}</span>
        </div>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">Contact Email</div>
            <div className="admin-settings-row-desc">Email address for contact inquiries</div>
          </div>
          <span className="admin-settings-row-value">{env.VITE_CONTACT_EMAIL}</span>
        </div>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">App URL</div>
            <div className="admin-settings-row-desc">Canonical URL for the site</div>
          </div>
          <span className="admin-settings-row-value">
            {env.VITE_APP_URL || 'Not set'}
          </span>
        </div>
      </div>

      <div className="admin-settings-section">
        <h2>Admin</h2>
        <p>Admin panel configuration.</p>

        <div className="admin-settings-row">
          <div>
            <div className="admin-settings-row-label">Admin Secret</div>
            <div className="admin-settings-row-desc">
              Set VITE_ADMIN_SECRET in .env to change from the default
            </div>
          </div>
          <span className="admin-settings-row-value">
            {import.meta.env.VITE_ADMIN_SECRET ? '********' : 'Using default'}
          </span>
        </div>
      </div>
    </div>
  )
}
