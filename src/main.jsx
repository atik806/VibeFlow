import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry, captureError } from './lib/sentry.js'
import App from './App.jsx'
import './styles/index.css'

initSentry()

async function logGlobalError(level, message, error) {
  captureError(error, { route: window.location.pathname, level })
  try {
    const { logError } = await import('./lib/api/monitoring')
    await logError({
      level,
      message,
      stack: error?.stack,
      route: window.location.pathname,
      metadata: error ? { name: error.name } : undefined,
    })
  } catch {
    // monitoring lib unavailable — swallow
  }
}

window.onerror = (_msg, _source, _line, _col, error) => {
  logGlobalError('error', String(_msg), error)
}

window.onunhandledrejection = (event) => {
  const reason = event.reason
  logGlobalError('error', reason?.message || String(reason), reason)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
