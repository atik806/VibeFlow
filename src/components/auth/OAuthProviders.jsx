import { GoogleIcon } from '../../icons'

export function OAuthProviders({ onOAuth, disabled = false, loadingProvider = null }) {
  const providers = [
    { id: 'google', label: 'Google', Icon: GoogleIcon, className: 'oauth-btn--google' },
  ]

  return (
    <div className="oauth-providers">
      {providers.map(({ id, label, Icon, className }) => (
        <button
          key={id}
          type="button"
          className={`oauth-btn ${className}`}
          onClick={() => onOAuth(id)}
          disabled={disabled || (loadingProvider !== null && loadingProvider !== id)}
        >
          <Icon size={20} />
          <span>
            {loadingProvider === id ? 'Redirecting…' : `Continue with ${label}`}
          </span>
        </button>
      ))}
    </div>
  )
}
