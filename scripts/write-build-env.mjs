#!/usr/bin/env node
/**
 * Write build-time env for Vite from process.env.
 * Used in CI because `vercel pull` returns empty strings for encrypted secrets.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BUILD_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_CONTACT_EMAIL',
  'VITE_BRAND',
  'VITE_APP_URL',
  'VITE_ADMIN_SECRET',
  'VITE_SENTRY_DSN',
]

const lines = ['# Generated for production build — do not commit']
const missing = []

for (const key of BUILD_KEYS) {
  const value = process.env[key]
  if (value && value.trim() !== '') {
    lines.push(`${key}=${JSON.stringify(value)}`)
  } else if (key.startsWith('VITE_SUPABASE') && key !== 'VITE_SUPABASE_ANON_KEY') {
    missing.push(key)
  }
}

if (missing.length) {
  console.warn(`[build-env] Missing optional build vars: ${missing.join(', ')}`)
}

const outPath = join(process.cwd(), '.env.production')
writeFileSync(outPath, lines.join('\n') + '\n')
console.log(`[build-env] Wrote ${lines.length - 1} vars to .env.production`)
