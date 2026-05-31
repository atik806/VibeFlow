import { z } from 'zod'

const emptyToUndefined = (val) =>
  val === '' || val === null || val === undefined ? undefined : val

function readViteEnv(key) {
  return emptyToUndefined(import.meta.env[key])
}

/** Last-resort defaults when Vercel env vars are missing from a deploy (publishable key is public). */
const DEFAULT_SUPABASE_URL = 'https://qbadqyfwkjdcnxexboyz.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_IbvJ3pgGoySNekzxPxpgtQ_DeS_5ybT'

const envSchema = z.object({
  VITE_APP_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  VITE_CONTACT_EMAIL: z.string().email().default('hello@vibeflow.app'),
  VITE_BRAND: z.string().default('VibeFlow'),
  /** Supabase project URL (Settings → API). Optional until you wire Supabase. */
  VITE_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  /** Standard name for the public anon key used by createClient(). */
  VITE_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  /** Alias: some dashboards label this “publishable” — same value as anon for the JS client. */
  VITE_SUPABASE_PUBLISHABLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  VITE_OBJECT_DETECTION_API_URL: z.string().url().default('http://localhost:8000'),
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
  return (
    readViteEnv('VITE_SUPABASE_ANON_KEY') ||
    readViteEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (import.meta.env.PROD ? DEFAULT_SUPABASE_KEY : undefined)
  )
}

/**
 * Browser-safe Supabase config when URL + key are both set.
 * Returns null if Supabase is not configured (app still runs).
 */
export function getSupabaseBrowserConfig() {
  const url =
    readViteEnv('VITE_SUPABASE_URL') ||
    env.VITE_SUPABASE_URL ||
    (import.meta.env.PROD ? DEFAULT_SUPABASE_URL : undefined)
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
