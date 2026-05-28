import { z } from 'zod'
import { InferenceClient } from '@huggingface/inference'
import { rateLimit } from '../lib/rate-limiter.js'
import { sanitize } from '../lib/validation.js'
import { logger } from '../lib/logger.js'
import { initSentry, captureError } from '../lib/sentry.js'

initSentry()

const DEFAULT_MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
const DEFAULT_PROVIDER = 'fal-ai'

const promptSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required')
    .max(500, `Prompt must be 500 characters or fewer`)
    .transform((v) => sanitize(v)),
})

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
    logger.warn('HF_TOKEN not configured')
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

  const parsed = promptSchema.safeParse(payload)
  if (!parsed.success) {
    logger.warn('Prompt validation failed', { errors: parsed.error.flatten().fieldErrors })
    return sendJson(res, 422, {
      code: 'VALIDATION_ERROR',
      errors: parsed.error.flatten().fieldErrors,
    })
  }

  const { prompt } = parsed.data

  try {
    const client = new InferenceClient(token)
    const blob = await client.textToImage({
      provider: process.env.HF_PROVIDER || DEFAULT_PROVIDER,
      model: process.env.HF_MODEL || DEFAULT_MODEL,
      inputs: prompt,
    })

    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    logger.info('Image generated', { model: process.env.HF_MODEL || DEFAULT_MODEL })
    res.statusCode = 200
    res.setHeader('Content-Type', blob.type || 'image/png')
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('Content-Length', buffer.length)
    res.end(buffer)
  } catch (err) {
    const message = err?.message || 'Image generation failed.'
    const status = err?.status || 502
    captureError(err, { route: '/api/generate-image' })
    logger.error(message, { status })
    return sendJson(res, status, {
      code: 'UPSTREAM_ERROR',
      message: status === 503
        ? 'The model is warming up. Please try again shortly.'
        : 'The image service is temporarily unavailable.',
    })
  }
}

export default rateLimit({ max: 5, windowMs: 60_000, keyPrefix: 'rl:genimg' })(_handler)
