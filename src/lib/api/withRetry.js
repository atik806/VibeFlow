const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000

export async function withRetry(fn, { maxRetries = MAX_RETRIES, baseDelay = BASE_DELAY_MS } = {}) {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < maxRetries && isRetryable(err)) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500
        await new Promise((r) => setTimeout(r, delay))
      }
    }
  }

  throw lastError
}

function isRetryable(err) {
  if (!err) return false
  if (err?.name === 'AbortError') return false
  const msg = err.message || ''
  if (msg.includes('Please wait')) return false
  if (msg.includes('Too many requests')) return false
  if (msg.includes('validation')) return false
  if (msg.includes('Validation')) return false
  if (msg.includes('not configured')) return false
  if (msg.includes('form fields')) return false
  return true
}
