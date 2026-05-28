import * as Sentry from '@sentry/node'

let initialized = false

export function initSentry() {
  if (initialized) return true
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return false
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || 'production',
    tracesSampleRate: 0.1,
  })
  initialized = true
  return true
}

export function captureError(error, context) {
  if (!process.env.SENTRY_DSN) return
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context)
    Sentry.captureException(error)
  })
}

export { Sentry }
