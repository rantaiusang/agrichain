// src/api/auth.js
import { supabase } from './supabase.js'

/**
 * Register user baru
 * @param {string} email
 * @param {string} password
 * @param {string} role - 'PETANI', 'PEMBELI', 'LEMBAGA'
 * @returns {object} { data, error }
 */
export async function register(email, password, role = 'PETANI') {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    })

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('❌ Gagal register:', err.message)
    return { data: null, error: err }
  }
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {object} { data, error }
 */
export async function login(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    console.error('❌ Gagal login:', err.message)
    return { data: null, error: err }
  }
}

/**
 * Logout user saat ini
 */
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    console.log('✅ Logout berhasil')
  } catch (err) {
    console.error('❌ Gagal logout:', err.message)
  }
}
