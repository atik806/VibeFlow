import { InferenceClient } from '@huggingface/inference'

const DEFAULT_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
const DEFAULT_PROVIDER = 'fal-ai'
const MAX_PROMPT_LENGTH = 500

// Naive in-memory rate limiter — good enough for a single serverless
// instance / local dev. For production scale, swap for Upstash/Redis.
const rateBucket = new Map()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10

function rateLimit(key) {
  const now = Date.now()
  const entry = rateBucket.get(key) || { count: 0, resetAt: now + WINDOW_MS }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + WINDOW_MS
  }
  entry.count += 1
  rateBucket.set(key, entry)
  return entry.count <= MAX_PER_WINDOW
}

function getIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' })
  }

  const token = process.env.HF_TOKEN
  if (!token) {
    return sendJson(res, 503, {
      code: 'NOT_CONFIGURED',
      message:
        'Image generation is not configured on this deployment. Set the HF_TOKEN environment variable to enable it.',
    })
  }

  let payload
  try {
    payload = await readJson(req)
  } catch {
    return sendJson(res, 400, { code: 'BAD_JSON', message: 'Invalid JSON body.' })
  }

  const prompt = typeof payload?.prompt === 'string' ? payload.prompt.trim() : ''
  if (!prompt) {
    return sendJson(res, 400, { code: 'EMPTY_PROMPT', message: 'Prompt is required.' })
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return sendJson(res, 400, {
      code: 'PROMPT_TOO_LONG',
      message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`,
    })
  }

  const ip = getIp(req)
  if (!rateLimit(ip)) {
    return sendJson(res, 429, {
      code: 'RATE_LIMIT',
      message: 'Too many requests. Please slow down.',
    })
  }

  try {
    const client = new InferenceClient(token)
    const blob = await client.textToImage({
      provider: process.env.HF_PROVIDER || DEFAULT_PROVIDER,
      model: process.env.HF_MODEL || DEFAULT_MODEL,
      inputs: prompt,
    })

    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res.statusCode = 200
    res.setHeader('Content-Type', blob.type || 'image/png')
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('Content-Length', buffer.length)
    res.end(buffer)
  } catch (err) {
    const message = err?.message || 'Image generation failed.'
    const status = err?.status || 502
    console.error('[api/generate-image] failed:', message)
    return sendJson(res, status, {
      code: 'UPSTREAM_ERROR',
      message: status === 503
        ? 'The model is warming up. Please try again shortly.'
        : 'The image service is temporarily unavailable.',
    })
  }
}
