import { createClient } from '@supabase/supabase-js'
import { logger } from '../lib/logger.js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export async function createRequest(prompt) {
  const { data, error } = await supabase
    .from('requests')
    .insert([{ prompt, status: 'pending' }])
    .select()
    .single()

  if (error) {
    logger.error('createRequest failed', { message: error.message })
    throw error
  }
  logger.info('Request created', { id: data.id })
  return data.id
}

export async function updateRequest(id, imageData) {
  const { error } = await supabase
    .from('requests')
    .update({ image_data: imageData, status: 'completed' })
    .eq('id', id)

  if (error) {
    logger.error('updateRequest failed', { id, message: error.message })
    throw error
  }
  logger.info('Request updated', { id })
  return id
}

export async function getRequest(id) {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    logger.error('getRequest failed', { id, message: error.message })
    throw error
  }
  return data
}

export async function getAllRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('getAllRequests failed', { message: error.message })
    throw error
  }
  return data
}
