import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_URL: z.string().url().optional(),
  VITE_CONTACT_EMAIL: z.string().email().default('hello@vibeflow.app'),
  VITE_BRAND: z.string().default('Vibe Flow'),
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
