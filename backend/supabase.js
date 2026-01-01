// --- frontend/backend/supabase.js ---
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://nkcctncsjmcfsiguowms.supabase.co'
const SUPABASE_KEY = 'sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X'  // Publishable Key

export const supa = createClient(SUPABASE_URL, SUPABASE_KEY)
