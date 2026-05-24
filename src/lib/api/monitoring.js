import { getSupabase, isSupabaseConfigured } from '../supabaseClient'

export async function getErrorLogs(limit = 30) {
  if (!isSupabaseConfigured()) return []
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('error_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return data
}

export async function logError({ level = 'error', message, stack, route, metadata } = {}) {
  if (!isSupabaseConfigured()) return null
  const supabase = getSupabase()
  const { error } = await supabase.from('error_logs').insert([{
    level,
    message,
    stack,
    route,
    user_agent: navigator?.userAgent?.slice(0, 200),
    metadata: metadata || {},
  }])
  if (error) console.error('[monitoring] Failed to log error:', error)
}
