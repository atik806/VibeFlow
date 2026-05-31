import { env } from './env'

export function getAppOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return env.VITE_APP_URL || 'http://localhost:5173'
}
