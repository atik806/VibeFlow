import { Navigate, useLocation } from 'react-router-dom'
import { isAdminAuthenticated } from '../../lib/adminAuth'

export function AdminGuard({ children }) {
  const location = useLocation()

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
