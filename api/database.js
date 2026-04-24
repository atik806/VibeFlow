import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export async function createRequest(prompt) {
  const { data, error } = await supabase
    .from('requests')
    .insert([{ prompt, status: 'pending' }])
    .select()
    .single()
  
  if (error) throw error
  return data.id
}

export async function updateRequest(id, imageData) {
  const { error } = await supabase
    .from('requests')
    .update({ image_data: imageData, status: 'completed' })
    .eq('id', id)
  
  if (error) throw error
  return id
}

export async function getRequest(id) {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getAllRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}