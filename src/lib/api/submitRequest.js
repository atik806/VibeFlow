import { saveRequest } from './supabase'
import { isSupabaseConfigured } from '../supabaseClient'

const DEBOUNCE_MS = 2000
let lastSubmit = 0

export async function submitRequest(values) {
  const now = Date.now()
  if (now - lastSubmit < DEBOUNCE_MS) {
    throw new Error('Please wait a moment before submitting again.')
  }
  lastSubmit = now

  try {
    const res = await fetch('/api/submit-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (res.ok) {
      return await res.json()
    }

    if (res.status === 429) {
      throw new Error('Too many requests. Please wait a minute and try again.')
    }

    if (res.status === 422) {
      throw new Error('Please check your form fields and try again.')
    }
  } catch (err) {
    if (err.message.includes('Please wait')) throw err
    if (err.message.includes('Too many requests')) throw err
    console.warn('[submitRequest] API unavailable, falling back to direct Supabase:', err.message)
  }

  if (isSupabaseConfigured()) {
    const id = await saveRequest(values)
    if (id) return { id, message: "Your request has been submitted. We'll reach out within 24 hours." }
  }

  throw new Error('Could not submit request. Please try again later.')
}
