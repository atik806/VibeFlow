import { z } from 'zod'

export function requireServerEnv(name) {
  const val = process.env[name]
  if (!val || val.trim() === '') {
    console.error(`[env] Required server environment variable "${name}" is not set.`)
    if (typeof process !== 'undefined' && process.env.VERCEL) {
      console.warn(`[env] Set "${name}" in your Vercel project environment variables.`)
    }
  }
  return val || ''
}

export function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/<[^>]*>/g, '')
}

export function sanitizeHtml(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export function validateIp(str) {
  if (!str || typeof str !== 'string') return false
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(str)) {
    return str.split('.').every((n) => {
      const num = Number(n)
      return num >= 0 && num <= 255
    })
  }
  if (/^[0-9a-f:]+$/i.test(str) && str.includes(':')) return true
  return false
}

function getAuthHeader(req) {
  const h = req.headers?.authorization || req.headers?.Authorization || ''
  return h.startsWith('Bearer ') ? h.slice(7) : ''
}

export function requireAuth(req, res) {
  const secret = process.env.SETUP_SECRET
  if (!secret) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 'NOT_CONFIGURED',
      message: 'Set SETUP_SECRET environment variable to use this endpoint.',
    }))
    return null
  }
  const token = getAuthHeader(req)
  if (!token) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 'UNAUTHORIZED',
      message: 'Missing Authorization: Bearer <token> header.',
    }))
    return null
  }
  const payload = verifyToken(token, secret)
  if (!payload) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token.',
    }))
    return null
  }
  return payload
}

export function generateToken(payload, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const enriched = { ...payload, iat: Math.floor(Date.now() / 1000) }
  const body = btoa(JSON.stringify(enriched))
  const signature = btoa(secret + ':' + JSON.stringify(enriched))
  return `${header}.${body}.${signature}`
}

export function verifyToken(token, secret) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const body = JSON.parse(atob(parts[1]))
    const expectedSig = btoa(secret + ':' + JSON.stringify({ ...body, iat: body.iat }))
    if (parts[2] !== expectedSig) return null
    if (body.exp && Date.now() > body.exp * 1000) return null
    return body
  } catch {
    return null
  }
}

export function validateId(val) {
  if (typeof val === 'number') return Number.isInteger(val) && val > 0
  if (typeof val === 'string') {
    const num = Number(val)
    return Number.isInteger(num) && num > 0
  }
  return false
}

const SERVICE_TITLES = [
  'Design Services',
  'Development Services',
  'Image Generation (Free)',
  'Writing & Content',
  'Tech & Advanced',
  'Other Services',
]

const SUBCATEGORIES = {
  'Design Services': [
    'Graphic Designer', 'Logo Designer', 'UI/UX Designer',
    'Social Media Post Design', 'Banner/Poster Designer', 'Thumbnail Designer',
  ],
  'Development Services': [
    'Web Development (Frontend/Backend)', 'Website Design (Portfolio, Business)',
    'E-commerce Website', 'Mobile App Development (Android/iOS)',
    'Desktop Software Development',
  ],
  'Image Generation (Free)': [
    'AI Image Generation', 'Art Generation', 'Concept Art',
    'Character Design', 'Logo Generation',
  ],
  'Writing & Content': [
    'Content Writing', 'Blog Writing', 'Resume/CV Writing', 'Script Writing',
  ],
  'Tech & Advanced': [
    'Machine Learning Projects', 'AI Model Development',
    'Data Analysis', 'Chatbot Development',
  ],
  'Other Services': [
    'Presentation Design', 'Data Entry', 'Virtual Assistant',
    'Translation Service', 'Social Media Marketing',
  ],
}

const BUDGETS = ['under-500', '500-1000', '1000-2500', '2500-5000', '5000+']

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(80, 'Name must be 80 characters or fewer')
  .transform((v) => sanitize(v))

export const emailSchema = z
  .string()
  .email('Enter a valid email address')
  .transform((v) => v.toLowerCase().trim())

export const descriptionSchema = z
  .string()
  .min(20, 'Description must be at least 20 characters')
  .max(2000, 'Description must be 2000 characters or fewer')
  .transform((v) => sanitize(v))

export const serviceSchema = z
  .string()
  .refine((v) => SERVICE_TITLES.includes(v), 'Select a valid service category')

export const subcategorySchema = (service) =>
  z
    .string()
    .refine(
      (v) => {
        const subs = SUBCATEGORIES[service]
        return subs ? subs.includes(v) : false
      },
      { message: 'Select a valid subcategory for the selected service' }
    )

export const budgetSchema = z.enum(BUDGETS, {
  message: 'Select a valid budget range',
})

export function getServiceTitles() {
  return SERVICE_TITLES
}

export function getSubcategories(service) {
  return SUBCATEGORIES[service] || []
}

export function getBudgets() {
  return BUDGETS
}
