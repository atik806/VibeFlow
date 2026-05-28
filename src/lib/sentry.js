import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

export function initSentry() {
  if (!dsn) return false
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || 'production',
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
  })
  return true
}

export function captureError(error, context) {
  if (!dsn) return
  Sentry.withScope((scope) => {
    if (context) {
      if (context.route) scope.setTag('route', context.route)
      scope.setExtras(context)
    }
    Sentry.captureException(error)
  })
}

export { Sentry }
