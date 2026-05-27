import { Navigate, useLocation, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '../ui/Spinner'

export function UserGuard({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const outletCtx = useOutletContext()

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children ?? <Outlet context={outletCtx} />
}
