#!/usr/bin/env node
/**
 * vercel pull sometimes writes empty strings for encrypted secrets.
 * Empty values override real Vercel env at build time and break the bundle.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const envPath = join(process.cwd(), '.vercel', '.env.production.local')

if (!existsSync(envPath)) {
  console.log('[sanitize-env] No .vercel/.env.production.local — skipping')
  process.exit(0)
}

const raw = readFileSync(envPath, 'utf8')
const kept = []
let dropped = 0

for (const line of raw.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) {
    kept.push(line)
    continue
  }

  const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
  if (!match) {
    kept.push(line)
    continue
  }

  const [, key, rawValue] = match
  let value = rawValue.trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }

  if (value === '') {
    dropped++
    console.log(`[sanitize-env] Dropped empty ${key}`)
    continue
  }

  kept.push(line)
}

writeFileSync(envPath, kept.join('\n'))
console.log(`[sanitize-env] Kept ${kept.length} lines, dropped ${dropped} empty values`)
