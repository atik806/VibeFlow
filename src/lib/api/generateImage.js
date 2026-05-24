// Client-side helper that hits our own `/api/generate-image` proxy.
// The proxy (see api/generate-image.js + vite.config.js) keeps the
// Hugging Face token on the server so it never ships to the browser.

async function logError(message, error) {
  try {
    const { logError: log } = await import('./monitoring')
    await log({
      level: 'error',
      message,
      stack: error?.stack,
      route: window.location.pathname,
      metadata: { code: error?.code, status: error?.status },
    })
  } catch {}
}

export async function generateImage(prompt, { signal } = {}) {
  const trimmed = (prompt || '').trim()
  if (!trimmed) {
    throw new ImageGenerationError('EMPTY_PROMPT', 'Please enter a prompt first.')
  }
  if (trimmed.length > 500) {
    throw new ImageGenerationError('PROMPT_TOO_LONG', 'Prompt must be 500 characters or less.')
  }

  let response
  try {
    response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed }),
      signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    logError('Image generation network error', err)
    throw new ImageGenerationError(
      'NETWORK',
      "Couldn't reach the image service. Check your connection and try again."
    )
  }

  if (!response.ok) {
    let code = 'UNKNOWN'
    let message = 'The image service returned an error.'
    try {
      const body = await response.json()
      if (body?.code) code = body.code
      if (body?.message) message = body.message
    } catch {
      // fall through to status-based messaging
    }
    if (response.status === 401 || response.status === 403) {
      code = 'AUTH'
      message = 'Image service is not configured. Please contact support.'
    } else if (response.status === 429) {
      code = 'RATE_LIMIT'
      message = 'Too many requests. Please try again in a minute.'
    } else if (response.status === 503) {
      code = 'MODEL_LOADING'
      message = 'The model is warming up. Please try again shortly.'
    }
    logError(`Image generation API error ${response.status}: ${code}`, { code, status: response.status })
    throw new ImageGenerationError(code, message, response.status)
  }

  const blob = await response.blob()
  if (!blob || blob.size === 0) {
    logError('Image generation empty response', null)
    throw new ImageGenerationError('EMPTY_IMAGE', 'Received an empty image.')
  }
  return URL.createObjectURL(blob)
}

export class ImageGenerationError extends Error {
  constructor(code, message, status) {
    super(message)
    this.name = 'ImageGenerationError'
    this.code = code
    this.status = status
  }
}
