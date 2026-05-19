import { getSupabase, isSupabaseConfigured } from '../supabaseClient'

export async function saveRequest(formData) {
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      console.warn('[Supabase] saveRequest skipped: set VITE_SUPABASE_URL and a public key in .env')
    }
    return null
  }

  const supabase = getSupabase()

  const payload = {
    prompt: JSON.stringify({
      name: formData.name,
      email: formData.email,
      service: formData.service,
      subcategory: formData.subcategory,
      description: formData.description,
      budget: formData.budget,
    }),
    status: 'pending',
  }

  try {
    const { data, error } = await supabase
      .from('requests')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('[Supabase] Error saving request:', error.message, error.details)
      return null
    }

    return data?.id || data?.insertedId
  } catch (e) {
    console.error('[Supabase] Exception:', e?.message || e)
    return null
  }
}

export async function updateRequest(id, imageData) {
  if (!isSupabaseConfigured()) return

  const supabase = getSupabase()
  const { error } = await supabase
    .from('requests')
    .update({ image_data: imageData, status: 'completed' })
    .eq('id', id)

  if (error) {
    console.error('[Supabase] Error updating request:', error)
  }
}

export async function getAllRequests() {
  if (!isSupabaseConfigured()) return []

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}
