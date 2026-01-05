import { createClient } from "https://unpkg.com/@supabase/supabase-js@2"

const SUPABASE_URL = "https://nkcctncsjmcfsiguowms.supabase.co"
const SUPABASE_KEY = "PASTE_PUBLISHABLE_KEY_KAMU"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)
