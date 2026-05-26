import { validateIp } from './validation.js'

const store = new Map()
let kv = null

async function getKv() {
  if (kv) return kv
  try {
    const mod = await import('@vercel/kv')
    if (mod.kv && process.env.KV_URL) kv = mod.kv
  } catch {}
  return kv
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
    ?.split(',')[0]?.trim()
  if (xff && validateIp(xff)) return xff
  const remote = req.socket?.remoteAddress
  if (remote && validateIp(remote)) return remote
  return 'unknown'
}

export function rateLimit({ max = 10, windowMs = 60_000, keyPrefix = 'rl' } = {}) {
  return function withRateLimit(handler) {
    return async function rateLimitedHandler(req, res) {
      const ip = getClientIp(req)
      const key = `${keyPrefix}:${ip}`
      const now = Date.now()

      const client = await getKv()
      if (client) {
        const entry = await client.get(key)
        if (entry && now - entry.start < windowMs) {
          if (entry.count >= max) {
            const retryAfter = Math.ceil((windowMs - (now - entry.start)) / 1000)
            res.statusCode = 429
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Retry-After', retryAfter)
            return res.end(JSON.stringify({ code: 'RATE_LIMIT', message: 'Too many requests. Please slow down.' }))
          }
          await client.incr(key.replace('rl:', 'count:'))
        } else {
          await client.set(key, { start: now, count: 1 })
        }
        return handler(req, res)
      }

      const entry = store.get(key)
      if (entry && now - entry.start < windowMs) {
        entry.count++
        if (entry.count >= max) {
          const retryAfter = Math.ceil((windowMs - (now - entry.start)) / 1000)
          res.statusCode = 429
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Retry-After', retryAfter)
          return res.end(JSON.stringify({ code: 'RATE_LIMIT', message: 'Too many requests. Please slow down.' }))
        }
      } else {
        store.set(key, { start: now, count: 1 })
      }

      return handler(req, res)
    }
  }
}
