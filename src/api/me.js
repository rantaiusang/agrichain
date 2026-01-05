// src/api/me.js
import { supabase } from './supabase.js'

/**
 * Ambil data user yang sedang login
 * @returns user object atau null jika tidak ada
 */
export async function getMe() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    return data?.user || null
  } catch (err) {
    console.error('❌ Gagal ambil user:', err.message)
    return null
  }
}
