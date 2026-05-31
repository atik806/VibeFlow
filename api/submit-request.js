import { z } from 'zod'
import { rateLimit } from '../lib/rate-limiter.js'
import {
  nameSchema,
  emailSchema,
  descriptionSchema,
  serviceSchema,
  budgetSchema,
  getSubcategories,
  sanitize,
} from '../lib/validation.js'
import { logger } from '../lib/logger.js'
import { initSentry, captureError } from '../lib/sentry.js'

initSentry()

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      if (!raw) return resolve({})
      try { resolve(JSON.parse(raw)) } catch (err) { reject(err) }
    })
    req.on('error', reject)
  })
}

const bodySchema = z.object({
  name: nameSchema,
  email: emailSchema,
  service: serviceSchema,
  subcategory: z.string(),
  description: descriptionSchema,
  budget: budgetSchema,
  user_id: z.string().uuid().optional(),
}).superRefine((data, ctx) => {
  const subs = getSubcategories(data.service)
  if (!subs.includes(data.subcategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['subcategory'],
      message: 'Select a valid subcategory for the selected service',
    })
  }
})

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

  let payload
  try {
    payload = await readJson(req)
  } catch {
    return sendJson(res, 400, { code: 'BAD_JSON', message: 'Invalid JSON body.' })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
    logger.warn('Request validation failed', { errors: parsed.error.flatten().fieldErrors })
    return sendJson(res, 422, {
      code: 'VALIDATION_ERROR',
      errors: parsed.error.flatten().fieldErrors,
    })
  }

  const data = parsed.data

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  let recordId = null

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: inserted, error } = await supabase
        .from('project_requests')
        .insert([{
          name: sanitize(data.name),
          email: data.email,
          service: data.service,
          subcategory: data.subcategory,
          description: sanitize(data.description),
          budget: data.budget,
          status: 'new',
          ...(data.user_id ? { user_id: data.user_id } : {}),
        }])
        .select()
        .single()
      if (error) {
        logger.error('Supabase insert error', { message: error.message, details: error.details, code: error.code })
        captureError(error, { route: '/api/submit-request', service: data.service })
        return sendJson(res, 500, {
          code: 'INSERT_FAILED',
          message: 'Could not save your request. The database constraint rejected the data.',
        })
      }
      if (inserted) {
        recordId = inserted.id
        logger.info('Request submitted', { id: recordId, service: data.service })
      }
    } catch (err) {
      captureError(err, { route: '/api/submit-request', service: data.service })
      logger.error('Supabase insert error', { message: err.message })
      return sendJson(res, 500, {
        code: 'INTERNAL_ERROR',
        message: 'Server error while saving your request.',
      })
    }
  }

  return sendJson(res, 200, {
    id: recordId,
    message: "Your request has been submitted. We'll reach out within 24 hours.",
  })
}

export default rateLimit({ max: 3, windowMs: 60_000, keyPrefix: 'rl:submit' })(_handler)
