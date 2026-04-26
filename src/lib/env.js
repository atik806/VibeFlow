import { z } from 'zod'

const emptyToUndefined = (val) => (val === '' ? undefined : val)

const envSchema = z.object({
  VITE_APP_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  VITE_CONTACT_EMAIL: z.string().email().default('hello@vibeflow.app'),
<<<<<<< HEAD
  VITE_BRAND: z.string().default('Vibe Flow'),
  /** Supabase project URL (Settings → API). Optional until you wire Supabase. */
  VITE_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  /** Standard name for the public anon key used by createClient(). */
  VITE_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  /** Alias: some dashboards label this “publishable” — same value as anon for the JS client. */
  VITE_SUPABASE_PUBLISHABLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
=======
  VITE_BRAND: z.string().default('VibeFlow'),
  VITE_OBJECT_DETECTION_API_URL: z.string().url().default('http://localhost:8000'),
>>>>>>> f7a944d (Feature: Play with ai)
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.warn(
    '[env] Some environment variables failed validation; using defaults.',
    parsed.error.flatten().fieldErrors
  )
}

export const env = parsed.success
  ? parsed.data
  : envSchema.parse({ ...import.meta.env })

/** Public anon / publishable key for @supabase/supabase-js (second argument to createClient). */
export function getSupabaseAnonKey() {
  return env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY
}

/**
 * Browser-safe Supabase config when URL + key are both set.
 * Returns null if Supabase is not configured (app still runs).
 */
export function getSupabaseBrowserConfig() {
  const url = env.VITE_SUPABASE_URL
  const anonKey = getSupabaseAnonKey()
  if (!url || !anonKey) {
    if (import.meta.env.DEV && (url || anonKey)) {
      console.warn(
        '[env] Supabase is partially configured: set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY). See .env.example.'
      )
    }
    return null
  }
  return { url, anonKey }
}
