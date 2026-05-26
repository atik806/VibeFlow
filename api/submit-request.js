import { z } from 'zod'
import { rateLimit } from '../lib/rate-limiter.js'

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  service: z.string().min(1),
  subcategory: z.string().min(1),
  description: z.string().min(20).max(2000),
  budget: z.string().min(1),
})

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

const _handler = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    return sendJson(res, 405, { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' })
  }

  let payload
  try {
    payload = await readJson(req)
  } catch {
    return sendJson(res, 400, { code: 'BAD_JSON', message: 'Invalid JSON body.' })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
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
        .insert([{ ...data, status: 'new' }])
        .select()
        .single()
      if (!error && inserted) recordId = inserted.id
    } catch (err) {
      console.error('[submit-request] Supabase insert error:', err)
    }
  }

  return sendJson(res, 200, {
    id: recordId,
    message: "Your request has been submitted. We'll reach out within 24 hours.",
  })
}

export default rateLimit({ max: 3, windowMs: 60_000, keyPrefix: 'rl:submit' })(_handler)
