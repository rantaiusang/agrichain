// src/api/supabase.js
import { createClient } from '@supabase/supabase-js'

// Ambil environment variables dari VITE (frontend)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Pastikan ENV terisi
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase URL atau Key belum diatur di .env / Vercel')
}

// Buat client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,     // simpan session otomatis di browser
    autoRefreshToken: true    // refresh token otomatis saat expired
  }
})
