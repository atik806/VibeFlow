import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  service: z.string().min(1),
  subcategory: z.string().min(1),
  description: z.string().min(20).max(2000),
  budget: z.string().min(1),
})

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const rateBucket = new Map()

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

function htmlTeamNotification(data) {
  return `
    <h2>New Project Request</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${data.email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Service</td><td style="padding:8px">${data.service}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Subcategory</td><td style="padding:8px">${data.subcategory}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Budget</td><td style="padding:8px">${data.budget}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Description</td><td style="padding:8px">${data.description}</td></tr>
    </table>
  `
}

function htmlClientConfirmation(name) {
  return `
    <h2>Thanks for reaching out, ${name}!</h2>
    <p>We've received your project request and will review it within 24 hours on business days.</p>
    <p>If you have any urgent questions, feel free to reply to this email.</p>
    <br>
    <p>— The VibeFlow Team</p>
  `
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

  const ip = getIp(req)
  if (!rateLimit(ip)) {
    return sendJson(res, 429, { code: 'RATE_LIMIT', message: 'Too many requests. Please slow down.' })
  }

  let payload
  try {
    payload = await readJson(req)
  } catch {
    return sendJson(res, 400, { code: 'BAD_JSON', message: 'Invalid JSON body.' })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
    return sendJson(res, 422, { code: 'VALIDATION_ERROR', errors: parsed.error.flatten().fieldErrors })
  }

  const data = parsed.data

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  const resendKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL || process.env.VITE_CONTACT_EMAIL || 'hello@vibeflow.app'
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  let recordId = null
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data: inserted, error } = await supabase
        .from('project_requests')
        .insert([{ ...data, status: 'new' }])
        .select()
        .single()
      if (!error && inserted) {
        recordId = inserted.id
      }
    } catch (err) {
      console.error('[submit-request] Supabase insert error:', err)
    }
  }

  if (resendKey) {
    try {
      const resend = new Resend(resendKey)
      const from = `VibeFlow <${resendFrom}>`

      await Promise.allSettled([
        resend.emails.send({
          from,
          to: contactEmail,
          subject: `New project request from ${data.name} — ${data.service}`,
          html: htmlTeamNotification(data),
        }),
        resend.emails.send({
          from,
          to: data.email,
          subject: `We received your request, ${data.name}!`,
          html: htmlClientConfirmation(data.name),
        }),
      ])
    } catch (err) {
      console.error('[submit-request] Email error:', err)
    }
  }

  return sendJson(res, 200, {
    id: recordId,
    message: "Your request has been submitted. We'll reach out within 24 hours.",
  })
}
