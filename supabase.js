import { createClient } from '@supabase/supabase-js'

// ✅ PERBAIKAN: Menggunakan Anon Key (Safe for Public)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
