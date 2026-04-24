import { createClient } from '@supabase/supabase-js'
import { getSupabaseBrowserConfig } from './env'

let client

export function isSupabaseConfigured() {
  return getSupabaseBrowserConfig() !== null
}

/**
 * Shared browser Supabase client (singleton).
 * @throws {Error} if URL or anon key is missing — check isSupabaseConfigured() first.
 */
export function getSupabase() {
  const cfg = getSupabaseBrowserConfig()
  if (!cfg) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) to .env — see .env.example.'
    )
  }
  if (!client) {
    client = createClient(cfg.url, cfg.anonKey)
  }
  return client
}
