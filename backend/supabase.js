// backend/supabase.js
import { createClient } from '@supabase/supabase-js'

// Baca dari environment variables Vercel
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY  // Service Role Key (rahasia)

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
