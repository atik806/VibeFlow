import { InferenceClient } from '@huggingface/inference'
import { rateLimit } from '../lib/rate-limiter.js'
import { sanitize } from '../lib/validation.js'

const DEFAULT_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
const DEFAULT_PROVIDER = 'fal-ai'
const MAX_PROMPT_LENGTH = 500
const MIN_PROMPT_LENGTH = 1

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

const _handler = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' })
  }

  const ct = req.headers['content-type'] || ''
  if (!ct.includes('application/json')) {
    return sendJson(res, 415, { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Send application/json.' })
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

  const rawPrompt = typeof payload?.prompt === 'string' ? payload.prompt : ''
  const prompt = sanitize(rawPrompt)
  if (prompt.length < MIN_PROMPT_LENGTH) {
    return sendJson(res, 400, { code: 'EMPTY_PROMPT', message: 'Prompt is required.' })
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return sendJson(res, 400, {
      code: 'PROMPT_TOO_LONG',
      message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.`,
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

export default rateLimit({ max: 5, windowMs: 60_000, keyPrefix: 'rl:genimg' })(_handler)