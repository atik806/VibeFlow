import { getSupabase, isSupabaseConfigured } from './supabaseClient'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateAvatarFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image must be under 2MB.')
  }
}

export async function uploadAvatar(userId, file) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured')

  validateAvatarFile(file)

  const ext = file.name.split('.').pop() || 'png'
  const filePath = `${userId}/${crypto.randomUUID()}.${ext}`

  const supabase = getSupabase()
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}

export async function deleteAvatar(url) {
  if (!url || !isSupabaseConfigured()) return

  const supabase = getSupabase()
  const bucketUrl = supabase.storage.from('avatars').getPublicUrl('').data.publicUrl
  const prefix = bucketUrl.endsWith('/') ? bucketUrl : bucketUrl + '/'

  if (!url.startsWith(prefix)) return

  const filePath = url.slice(prefix.length)
  await supabase.storage.from('avatars').remove([filePath])
}

const EMOJIS = [
  '😀', '😎', '🚀', '💻', '🎨', '🔥', '🎯', '💡',
  '👨‍💻', '👩‍🎨', '🎮', '🌟', '🦊', '🐱', '🌺', '🍀',
  '⚡', '🎵', '🌈', '🦄', '🏆', '🎪', '🧩', '🎭',
]

export { EMOJIS }
