import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '../lib/rate-limiter.js'
import { requireAuth, requireServerEnv } from '../lib/validation.js'

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(body))
}

const _handler = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { code: 'METHOD_NOT_ALLOWED', message: 'Use GET.' })
  }

  const auth = requireAuth(req, res)
  if (!auth) return

  const supabaseUrl = requireServerEnv('SUPABASE_URL')
  const serviceKey = requireServerEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    return sendJson(res, 503, {
      code: 'NOT_CONFIGURED',
      message: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.',
    })
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  try {
    const { data: active, error: activeErr } = await supabase
      .from('visitor_sessions')
      .select('session_id, page_path, last_active_at')
      .gte('last_active_at', fiveMinAgo)
      .order('last_active_at', { ascending: false })

    if (activeErr) throw activeErr

    const { data: last24h, error: historyErr } = await supabase
      .from('visitor_sessions')
      .select('visited_at')
      .gte('visited_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (historyErr) throw historyErr

    return sendJson(res, 200, {
      online: active?.length || 0,
      sessions: active || [],
      last24h: last24h?.length || 0,
    })
  } catch (err) {
    console.error('[api/visitors] Error:', err.message)
    return sendJson(res, 502, { code: 'QUERY_FAILED', message: err.message })
  }
}

export default rateLimit({ max: 30, windowMs: 60_000, keyPrefix: 'rl:visitors' })(_handler)
