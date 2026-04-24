import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

console.log('[Supabase] Initializing with URL:', supabaseUrl)
console.log('[Supabase] Key exists:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing env variables!')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function saveRequest(prompt) {
  console.log('[Supabase] Attempting to save request:', prompt)
  
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert([{ prompt, status: 'pending' }])
      .select()
      .single()
    
    if (error) {
      console.error('[Supabase] Error saving request:', error.message, error.details)
      return null
    }
    
    console.log('[Supabase] Request saved:', data)
    return data?.id || data?.insertedId
  } catch (e) {
    console.error('[Supabase] Exception:', e.message)
    return null
  }
}

export async function updateRequest(id, imageData) {
  const { error } = await supabase
    .from('requests')
    .update({ image_data: imageData, status: 'completed' })
    .eq('id', id)
  
  if (error) {
    console.error('[Supabase] Error updating request:', error)
  }
}

export async function getAllRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data
}